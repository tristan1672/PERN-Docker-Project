import { Channel } from "amqplib";

type Domain = "scene";
type Category = "color" | "shape";
type Action = "updated" | "deleted" | "created";
type Type = "sphere" | "cube" | "torus";

export interface TopicObject {
  domain: Domain | "*";
  category: Category | "*";
  action: Action | "*";
  type: Type | "*";
  color: string | "*"; // hex or wildcard
}

export async function registerConsumer(
  channel: Channel,
  exchange: string,
  topic: TopicObject,
  name: string,
  onMessage: (msg: any, topic: TopicObject) => void
) {
  const routingKey = buildRoutingKey(topic);
  const queueName = name; //device name as queue

  await channel.assertQueue(queueName, {
    durable: false, // messages not persisted across restarts (you can change this)
    autoDelete: false, // don't auto-delete when no consumer (or set true for short-lived devices)
  });

  // Bind the routing key to the named device queue
  await channel.bindQueue(queueName, exchange, routingKey);

  // Start consuming messages from the queue
  channel.consume(
    queueName,
    (msg) => {
      if (msg) {
        const topicObject = deconstructRoutingKey(msg.fields.routingKey);
        onMessage(msg, topicObject);
      }
    },
    { noAck: true }
  );

  console.log(
    `[Consumer] '${queueName}' bound to '${exchange}' with routing key '${routingKey}'`
  );
}

function buildRoutingKey(topic: TopicObject): string {
  // If you want optional color, fallback to `*` or empty
  const type = topic.type || "*";
  const color = topic.color || "*";

  if (type == "*" && color == "*") {
    return `${topic.domain}.${topic.category}.${topic.action}.#`;
  } else {
    return `${topic.domain}.${topic.category}.${topic.action}.${type}.${color}`;
  }
}

function deconstructRoutingKey(routingKey: string): TopicObject {
  const [domain, category, action, type, color] = routingKey.split(".");
  return {
    domain: domain as Domain | "*",
    category: category as Category | "*",
    action: action as Action | "*",
    type: type as Type | "*",
    color: color as string | "*",
  };
}
