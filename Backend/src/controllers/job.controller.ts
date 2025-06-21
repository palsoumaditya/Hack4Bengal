import { Request, Response } from "express";
import { db } from "@/config/drizzle";
import { jobs } from "@/db/schema";
import { workers } from "@/db/schema";
import { users } from "@/db/schema";
import { jobSchema } from "@/types/validation";
import { eq } from "drizzle-orm";
import { parse } from "dotenv";
import { ZodError } from "zod";
import {
  redisPub,
  isRedisConnected,
  ensureRedisConnection,
} from "@/config/redis";
import { sql } from "drizzle-orm";
import { broadcastMonitor } from "@/utils/broadcast.monitor";
import { logBookingOnChain } from "@/utils/aptosBooking";

export const createJob = async (req: Request, res: Response) => {
  try {
    const parsedData = jobSchema
      .omit({ id: true, createdAt: true })
      .parse(req.body);

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, parsedData.userId));

    if (existingUser.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const jobData = {
      ...parsedData,
      bookedFor: parsedData.bookedFor ? new Date(parsedData.bookedFor) : null,
    };

    const newJob = await db.insert(jobs).values(jobData).returning();
    const createdJob = newJob[0];

    broadcastMonitor.trackJobCreation(createdJob.id);

    try {
      if (!isRedisConnected()) await ensureRedisConnection();
      if (!isRedisConnected()) throw new Error("Failed to connect to Redis");

      const broadcastData = {
        ...createdJob,
        userId: parsedData.userId,
        lat: parsedData.lat,
        lng: parsedData.lng,
      };

      await redisPub.publish("new-job", JSON.stringify(broadcastData));
    } catch (broadcastError) {
      broadcastMonitor.trackFailedBroadcast(createdJob.id, broadcastError);
    }

    res.status(201).json({ message: "Job created successfully", data: createdJob });
  } catch (error: any) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      res.status(400).json({ message: "Validation failed", errors: formattedErrors });
      return;
    }
    res.status(500).json({ error: error?.message || "Failed to create job" });
  }
};

export const updateJobStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "in_progress",
      "completed",
      "cancelled",
    ] as const;

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: "Invalid job status" });
      return;
    }

    const updated = await db
      .update(jobs)
      .set({ status })
      .where(eq(jobs.id, id))
      .returning();

    if (!updated.length) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const updatedJob = updated[0];

    if (status === "confirmed") {
      if (!updatedJob.workerId) {
        res.status(400).json({ error: "Worker ID is missing" });
        return;
      }
      const dateValue = updatedJob.bookedFor ?? updatedJob.createdAt;
      if (!dateValue) {
        res.status(400).json({ error: "No valid date for booking" });
        return;
      }
      const txHash = await logBookingOnChain({
        jobId: parseInt(updatedJob.id),
        user: updatedJob.userId,
        worker: updatedJob.workerId,
        timestamp: Math.floor(new Date(dateValue).getTime() / 1000),
      });

      if (!txHash) {
        console.warn("⚠️ [APTOS] Blockchain logging failed");
      }
    }

    res.status(200).json({ message: "Job status updated", data: updatedJob });
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      res.status(400).json({ message: "Validation failed", errors: formattedErrors });
      return;
    }
    res.status(400).json({ error: "Failed to update job status" });
  }
};
