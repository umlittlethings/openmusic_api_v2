const amqp = require('amqplib');

class ProducerService {
  static async sendMessage(queue, message) {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    setTimeout(() => {
      connection.close();
    }, 1000);
  }
}

module.exports = ProducerService;