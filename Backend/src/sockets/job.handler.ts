import { db } from "../config/drizzle";
import { jobs, workers } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { io } from "./socket.server";

interface AcceptJobPayload {
  jobId: string;
  workerId: string;
}

interface DeclineJobPayload {
  jobId: string;
  workerId: string;
  reason?: string;
}

export const registerJobSocketHandlers = (socket: any) => {
  console.log(
    "🔌 [SOCKET_HANDLER] Registering job socket handlers for socket:",
    socket.id
  );

  socket.on("accept_job", async ({ jobId, workerId }: AcceptJobPayload) => {
    console.log("🤝 [JOB_ACCEPT] Worker attempting to accept job:", {
      jobId,
      workerId,
    });

    try {
      // Check if job is still available
      const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));

      if (!job) {
        console.log("❌ [JOB_ACCEPT] Job not found:", jobId);
        socket.emit("job_error", { message: "Job not found" });
        return;
      }

      console.log("📋 [JOB_ACCEPT] Job found:", {
        jobId,
        status: job.status,
        currentWorkerId: job.workerId,
      });

      if (job.status !== "pending") {
        console.log("❌ [JOB_ACCEPT] Job not available:", {
          status: job.status,
          reason: job.workerId
            ? "Already accepted by another worker"
            : "Job is no longer available",
        });
        socket.emit("job_error", {
          message: job.workerId
            ? "Job already accepted by another worker"
            : "Job is no longer available",
        });
        return;
      }

      // Check if worker exists and is available
      const [worker] = await db
        .select()
        .from(workers)
        .where(eq(workers.id, workerId));

      if (!worker) {
        console.log("❌ [JOB_ACCEPT] Worker not found:", workerId);
        socket.emit("job_error", { message: "Worker not found" });
        return;
      }

      console.log("✅ [JOB_ACCEPT] Worker verified:", {
        workerId,
        name: `${worker.firstName} ${worker.lastName}`,
      });

      // Update job with worker assignment
      console.log("💾 [JOB_ACCEPT] Updating job status to confirmed...");
      const [updatedJob] = await db
        .update(jobs)
        .set({
          workerId,
          status: "confirmed",
        })
        .where(eq(jobs.id, jobId))
        .returning();

      console.log("✅ [JOB_ACCEPT] Job status updated successfully");

      // Join job room for real-time updates
      const jobRoom = `job-${jobId}`;
      socket.join(jobRoom);
      console.log("🏠 [SOCKET_ROOM] Worker joined job room:", jobRoom);

      // Notify user that job has been accepted
      console.log("📤 [SOCKET_EMIT] Notifying user about job acceptance");
      io.to(`user-${job.userId}`).emit("job_accepted", {
        job: updatedJob,
        worker: {
          id: worker.id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          phoneNumber: worker.phoneNumber,
          experienceYears: worker.experienceYears,
        },
      });

      // Notify the accepting worker
      console.log("📤 [SOCKET_EMIT] Confirming job acceptance to worker");
      socket.emit("job_accepted_success", {
        job: updatedJob,
        message: "Job accepted successfully!",
      });

      // Notify other workers that job is no longer available
      console.log(
        "📤 [SOCKET_EMIT] Notifying other workers that job is unavailable"
      );
      io.emit("job_unavailable", {
        jobId,
        message: "This job has been accepted by another worker",
      });

      console.log(
        "🎉 [JOB_ACCEPT] Job acceptance process completed successfully"
      );
    } catch (error) {
      console.error("❌ [JOB_ACCEPT] Error accepting job:", error);
      socket.emit("job_error", { message: "Failed to accept job" });
    }
  });

  socket.on(
    "decline_job",
    async ({ jobId, workerId, reason }: DeclineJobPayload) => {
      console.log("❌ [JOB_DECLINE] Worker declining job:", {
        jobId,
        workerId,
        reason,
      });

      try {
        // Log the decline for analytics
        console.log(
          `📊 [JOB_DECLINE] Decline logged for worker ${workerId} on job ${jobId}${
            reason ? `: ${reason}` : ""
          }`
        );

        // Notify the worker that decline was processed
        console.log("📤 [SOCKET_EMIT] Confirming job decline to worker");
        socket.emit("job_declined", {
          jobId,
          message: "Job declined successfully",
        });

        console.log("✅ [JOB_DECLINE] Job decline processed successfully");
      } catch (error) {
        console.error("❌ [JOB_DECLINE] Error declining job:", error);
        socket.emit("job_error", { message: "Failed to decline job" });
      }
    }
  );

  socket.on("start_job", async ({ jobId, workerId }: AcceptJobPayload) => {
    console.log("🚀 [JOB_START] Worker attempting to start job:", {
      jobId,
      workerId,
    });

    try {
      // Verify worker owns this job
      const [job] = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.id, jobId), eq(jobs.workerId, workerId)));

      if (!job) {
        console.log("❌ [JOB_START] Job not found or unauthorized:", {
          jobId,
          workerId,
        });
        socket.emit("job_error", { message: "Job not found or unauthorized" });
        return;
      }

      console.log("📋 [JOB_START] Job verified:", {
        jobId,
        status: job.status,
      });

      if (job.status !== "confirmed") {
        console.log("❌ [JOB_START] Job not in confirmed status:", job.status);
        socket.emit("job_error", {
          message: "Job must be confirmed before starting",
        });
        return;
      }

      // Update job status to in_progress
      console.log("💾 [JOB_START] Updating job status to in_progress...");
      const [updatedJob] = await db
        .update(jobs)
        .set({
          status: "in_progress",
        })
        .where(eq(jobs.id, jobId))
        .returning();

      console.log("✅ [JOB_START] Job status updated to in_progress");

      // Notify user that work has started
      console.log("📤 [SOCKET_EMIT] Notifying user that work has started");
      io.to(`user-${job.userId}`).emit("job_started", {
        job: updatedJob,
        message: "Worker has started the job",
      });

      // Notify worker
      console.log("📤 [SOCKET_EMIT] Confirming job start to worker");
      socket.emit("job_started_success", {
        job: updatedJob,
        message: "Job started successfully!",
      });

      console.log("🎉 [JOB_START] Job start process completed successfully");
    } catch (error) {
      console.error("❌ [JOB_START] Error starting job:", error);
      socket.emit("job_error", { message: "Failed to start job" });
    }
  });

  socket.on("complete_job", async ({ jobId, workerId }: AcceptJobPayload) => {
    console.log("✅ [JOB_COMPLETE] Worker attempting to complete job:", {
      jobId,
      workerId,
    });

    try {
      // Verify worker owns this job
      const [job] = await db
        .select()
        .from(jobs)
        .where(and(eq(jobs.id, jobId), eq(jobs.workerId, workerId)));

      if (!job) {
        console.log("❌ [JOB_COMPLETE] Job not found or unauthorized:", {
          jobId,
          workerId,
        });
        socket.emit("job_error", { message: "Job not found or unauthorized" });
        return;
      }

      console.log("📋 [JOB_COMPLETE] Job verified:", {
        jobId,
        status: job.status,
      });

      if (job.status !== "in_progress") {
        console.log("❌ [JOB_COMPLETE] Job not in progress:", job.status);
        socket.emit("job_error", {
          message: "Job must be in progress before completing",
        });
        return;
      }

      // Update job status to completed
      console.log("💾 [JOB_COMPLETE] Updating job status to completed...");
      const [updatedJob] = await db
        .update(jobs)
        .set({
          status: "completed",
        })
        .where(eq(jobs.id, jobId))
        .returning();

      console.log("✅ [JOB_COMPLETE] Job status updated to completed");

      // Notify user that job is completed
      console.log("📤 [SOCKET_EMIT] Notifying user that job is completed");
      io.to(`user-${job.userId}`).emit("job_completed", {
        job: updatedJob,
        message: "Job has been completed successfully!",
      });

      // Notify worker
      console.log("📤 [SOCKET_EMIT] Confirming job completion to worker");
      socket.emit("job_completed_success", {
        job: updatedJob,
        message: "Job completed successfully!",
      });

      console.log(
        "🎉 [JOB_COMPLETE] Job completion process completed successfully"
      );
    } catch (error) {
      console.error("❌ [JOB_COMPLETE] Error completing job:", error);
      socket.emit("job_error", { message: "Failed to complete job" });
    }
  });

  console.log(
    "✅ [SOCKET_HANDLER] Job socket handlers registered successfully"
  );
};
