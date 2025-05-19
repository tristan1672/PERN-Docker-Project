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
  onMessage: (msg: any, topic: TopicObject) => void
) {
  const routingKey = buildRoutingKey(topic);
  console.log("listening for $", routingKey);
  const { queue } = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(queue, exchange, routingKey);

  channel.consume(
    queue,
    (msg) => {
      if (msg) {
        const topicObject = deconstructRoutingKey(msg.fields.routingKey);
        onMessage(msg, topicObject); // ✅ pass the raw message object
      }
    },
    { noAck: true }
  );

  console.log(`Consumer bound to ${exchange} with ${routingKey}`);
}

function buildRoutingKey(topic: TopicObject): string {
  //return `${topic.domain}.${topic.category}.${topic.action}.${topic.type}.${topic.color}`;
  return `${topic.domain}.${topic.category}.${topic.action}.#`;
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
