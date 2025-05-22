import { Channel } from "amqplib";
import { TopicObject, registerConsumer } from "./consumer";
import { clientManager } from "./clientManager";
import { EventEmitter } from "events";

let instance: ConsumerManager;

type ConsumerKey = string;

export function initConsumerManager(
  channel: Channel,
  exchange: string
): ConsumerManager {
  instance = new ConsumerManager(channel, exchange);
  console.log("ConsumerManager initialized.");
  return instance;
}

export function getConsumerManager(): ConsumerManager {
  if (!instance) throw new Error("ConsumerManager not initialized!");
  return instance;
}

function getConsumerKey(topic: TopicObject): ConsumerKey {
  return `${topic.domain}.${topic.category}.${topic.action}.${topic.type}.${topic.color}`;
}

export class ConsumerManager extends EventEmitter {
  private consumers: Map<ConsumerKey, boolean> = new Map();

  constructor(private channel: Channel, private exchange: string) {
    super();
    this.bindClientManagerEvents();
  }

  private bindClientManagerEvents() {
    clientManager.on("topicEmpty", (routingKey: string) => {
      this.removeConsumer(routingKey);
    });
  }

  public async ensureConsumer(topic: TopicObject, name: string) {
    console.log("Ensuring Consumer ", name);
    const key = getConsumerKey(topic);
    if (this.consumers.has(key)) {
      //console.log(`Device '${name}' exists..`);
      return;
    }

    await registerConsumer(
      this.channel,
      this.exchange,
      topic,
      (msg, topicObj) => {
        console.log("Received message for:", topicObj);
        const payload = JSON.parse(msg.content.toString());

        const routingKey = msg.fields.routingKey;
        console.log("[ClientManager] Lookup for:", routingKey);
        const clients = clientManager.getClientsByTopic(routingKey);

        clients.forEach((client) => {
          if (client.sse) {
            client.sse.res.write(
              `event: message\ndata: ${JSON.stringify(payload)}\n\n`
            );
          }
        });
      }
    );

    this.consumers.set(key, true);
  }

  private removeConsumer(routingKey: string) {
    // For now just delete from map.
    // Cleanup of RabbitMQ queue binding is not included here but can be added later if needed.
    this.consumers.delete(routingKey);
    console.log(`[ConsumerManager] Removed consumer for ${routingKey}`);
  }

  public getActiveTopics(): string[] {
    return [...this.consumers.keys()];
  }
}
