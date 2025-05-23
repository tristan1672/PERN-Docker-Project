import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import { rabbitMQProvider } from "./messaging/rabbitmq.provider";
// import { registerConsumer } from "./messaging/consumer";
// import { EventRouter } from "./messaging/eventrouter";
// import { TopicObject } from "./messaging/consumer";

import registerRoute from "./messaging/routes/register";
import eventsRoute from "./messaging/routes/events";
import { initConsumerManager } from "./messaging/consumerManager";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors()); // CORS is enabled here
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Enable JSON body parsing

// Root route
app.get("/", (req, res) => {
  console.log(req.method);
  res.send("Backend is running");
});

// Define routes
app.use(registerRoute);
app.use(eventsRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  bootstrapMessaging().catch((err) => {
    console.error(" Failed to start RabbitMQ messaging:", err);
  });
});

async function bootstrapMessaging() {
  await rabbitMQProvider.init();
  const channel = rabbitMQProvider.getChannel(); // e.g. returns channel
  const exchange = "scene.events"; // Example exchange

  initConsumerManager(channel, exchange); //initializing singleton consumerManager

  // const topics: TopicObject[] = [
  //   // {
  //   //   domain: "scene",
  //   //   category: "color",
  //   //   action: "updated",
  //   //   type: "*",
  //   //   color: "*",
  //   // },
  //   // {
  //   //   domain: "scene",
  //   //   category: "shape",
  //   //   action: "updated",
  //   //   type: "*",
  //   //   color: "*",
  //   // },
  //   // {
  //   //   domain: "scene",
  //   //   category: "shape",
  //   //   action: "updated",
  //   //   type: "cube",
  //   //   color: "FFFF00",
  //   // }, // specific example
  //   {
  //     domain: "scene",
  //     category: "color",
  //     action: "updated",
  //     type: "*",
  //     color: "*",
  //   },
  // ];

  // for (const topic of topics) {
  //   await registerConsumer(channel, exchange, topic, (msg, topic) => {
  //     const payload = msg.content.toString();
  //     EventRouter.handle(topic, payload);
  //   });
  // }
}
