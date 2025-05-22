import express from "express";
import { clientManager } from "../clientManager";
import { getConsumerManager } from "../consumerManager";
import { TopicObject } from "../../messaging/consumer";

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("[Register] Received registration request:", req.body);
  const { name, view, eventType } = req.body;

  if (!name || !view || !eventType) {
    return res
      .status(400)
      .json({ error: "[Register] Missing required fields" });
  }

  // Construct topic based on eventType and values
  const topic = req.body.topic;

  const [domain, category, action, type, color] = topic.split(".");

  const topicObject: TopicObject = {
    domain,
    category,
    action,
    type,
    color,
  };

  try {
    clientManager.registerClient(name, topic, view);
    console.log(`[Register] Device '${name}' registered for topic '${topic}'`);

    await getConsumerManager().ensureConsumer(topicObject, name);

    res.status(200).json({
      message: "[Register] Device registered successfully",
      id: name,
      topic,
    });
  } catch (err) {
    console.error("[Register] Failed to register client:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

//scene.shape.updated.cube.FFFF00
