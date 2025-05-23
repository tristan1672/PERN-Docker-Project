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

// function getConsumerKey(topic: TopicObject): ConsumerKey {
//   return `${topic.domain}.${topic.category}.${topic.action}.${topic.type}.${topic.color}`;
// }

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
    console.log("[ConsumerManager] Checking Consumer: ", name);

    if (this.consumers.has(name)) {
      console.log(
        `[ConsumerManager] Consumer already exists for client '${name}'`
      );
      return;
    }
    await registerConsumer(
      this.channel,
      this.exchange,
      topic,
      name,
      (msg, topicObj) => {
        console.log(
          `[ConsumerManager] Received message for device '${name}':`,
          topicObj
        );
        const payload = JSON.parse(msg.content.toString());

        console.log(
          `[ConsumerManager] Looking for ${name} in clientManager...`
        );
        const client = clientManager.getClient(name); // Lookup by device name
        if (client && client.sse) {
          console.log(`[ConsumerManager] Forwarding event to ${name}`);

          client.sse.res.write(
            `event: message\ndata: ${JSON.stringify(payload)}\n\n`
          );
        } else {
          console.log(
            `[ConsumerManager] Client ${name} not found in registration.`
          );
        }
      }
    );

    this.consumers.set(name, true);
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
