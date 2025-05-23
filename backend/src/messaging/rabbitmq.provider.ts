import * as amqp from "amqplib";

export class RabbitMQProvider {
  private connection!: amqp.Connection;
  private channel!: amqp.Channel;

  async init() {
    this.connection = await amqp.connect("amqp://192.168.6.100:5672"); //update public IP
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange("scene.events", "topic", {
      durable: false,
    });
    console.log("Connected to RabbitMQ");
  }

  async publish(exchange: string, routingKey: string, message: object) {
    if (!this.channel) throw new Error("RabbitMQ channel not initialized");
    const buffer = Buffer.from(JSON.stringify(message));
    this.channel.publish(exchange, routingKey, buffer);
  }

  getChannel() {
    if (!this.channel) throw new Error("Channel not initialized");
    return this.channel;
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}

export const rabbitMQProvider = new RabbitMQProvider();
