import { Server } from "socket.io";
import { initSocketRedisAdapter } from "@/config/socketRedis";
import { registerJobSocketHandlers } from "./job.handler";
import { registerJobLiveHandlers } from "./jobUpdates.handler";

export let io: Server;

export const initSocketServer = (server: any) => {
  console.log("🔌 [SOCKET_SERVER] Initializing Socket.IO server...");

  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  console.log("✅ [SOCKET_SERVER] Socket.IO server created with CORS enabled");

  // Initialize Redis adapter with error handling
  try {
    initSocketRedisAdapter(io);
    console.log("✅ [SOCKET_SERVER] Redis adapter initialized");
  } catch (error) {
    console.error(
      "❌ [SOCKET_SERVER] Failed to initialize Redis adapter:",
      error
    );
    console.log("⚠️  [SOCKET_SERVER] Continuing without Redis adapter...");
  }

  io.on("connection", (socket) => {
    console.log("🔗 [SOCKET_CONNECTION] New socket connected:", socket.id);

    // Handle connection errors
    socket.on("error", (error) => {
      console.error("❌ [SOCKET_ERROR] Socket error:", error);
    });

    socket.on("join_worker_room", ({ workerId }) => {
      console.log("🏠 [SOCKET_ROOM] Worker joining room:", {
        socketId: socket.id,
        workerId,
      });
      socket.join(`worker-${workerId}`);
      console.log("✅ [SOCKET_ROOM] Worker joined room successfully");
    });

    socket.on("join_user_room", ({ userId }) => {
      console.log("🏠 [SOCKET_ROOM] User joining room:", {
        socketId: socket.id,
        userId,
      });
      socket.join(`user-${userId}`);
      console.log("✅ [SOCKET_ROOM] User joined room successfully");
    });

    socket.on("join_job_room", ({ jobId }) => {
      console.log("🏠 [SOCKET_ROOM] Joining job room:", {
        socketId: socket.id,
        jobId,
      });
      socket.join(`job-${jobId}`);
      console.log("✅ [SOCKET_ROOM] Joined job room successfully");
    });

    // Test message handler for debugging
    socket.on("test_message", (data) => {
      console.log("🧪 [TEST] Received test message:", data);
      socket.emit("test_response", {
        message: "Test response from server",
        timestamp: new Date().toISOString(),
        socketId: socket.id,
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 [SOCKET_DISCONNECT] Socket disconnected:", {
        socketId: socket.id,
        reason,
      });
    });

    console.log(
      "🔌 [SOCKET_HANDLERS] Registering socket handlers for:",
      socket.id
    );

    try {
      registerJobSocketHandlers(socket);
      registerJobLiveHandlers(socket);
      console.log(
        "✅ [SOCKET_HANDLERS] Socket handlers registered successfully"
      );
    } catch (error) {
      console.error("❌ [SOCKET_HANDLERS] Failed to register handlers:", error);
    }
  });

  // Handle server-level errors
  io.engine.on("connection_error", (err) => {
    console.error("❌ [SOCKET_ENGINE] Connection error:", err);
  });

  console.log("🎉 [SOCKET_SERVER] Socket.IO server initialized successfully");
};
