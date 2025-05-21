import express from "express";
import { clientManager } from "../clientManager";

const router = express.Router();

const HEARTBEAT_INTERVAL = 30000; // 30 seconds

router.get("/events/:id", (req, res) => {
  const { id } = req.params;
  const client = clientManager.getClient(id);

  if (!client) {
    return res.status(404).json({ error: "Client not found" });
  }

  // Set SSE headers
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  // Attach to clientManager
  clientManager.attachSSE(id, res);

  // Initial message
  res.write(
    `event: connected\ndata: ${JSON.stringify({
      message: "SSE connected",
      id,
    })}\n\n`
  );
  console.log(`[SSE] Client '${id}' connected to SSE`);

  // Heartbeat
  const heartbeat = setInterval(() => {
    try {
      res.write(`event: ping\ndata: {}\n\n`);
    } catch (err) {
      console.warn(`[SSE] Failed heartbeat for '${id}':`, err);
      clearInterval(heartbeat);
      clientManager.removeClient(id);
      res.end();
    }
  }, HEARTBEAT_INTERVAL);

  // Clean up on client disconnect
  req.on("close", () => {
    clearInterval(heartbeat);
    clientManager.removeClient(id);
    console.log(`[SSE] Client '${id}' disconnected`);
  });
});

export default router;
