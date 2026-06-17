import amqp from 'amqplib';

class RabbitMQ {
  private connection: any = null;
  private channel: any = null;

  async connect(): Promise<void> {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://krishi_user:krishi_pass123@rabbitmq:5672';

      console.log('🐇 Connecting to RabbitMQ...');
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange('user.events', 'topic', { durable: true });
      await this.channel.assertQueue('user.created', { durable: true });
      await this.channel.bindQueue('user.created', 'user.events', 'user.created');

      console.log('✅ RabbitMQ connected');

      this.connection.on('close', () => {
        console.log('⚠️ RabbitMQ connection closed, reconnecting...');
        setTimeout(() => this.connect(), 5000);
      });

    } catch (error) {
      console.error('❌ RabbitMQ connection failed:', error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async consume(queue: string, callback: (message: any) => Promise<void>): Promise<void> {
    try {
      await this.channel.consume(queue, async (msg: any) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await callback(content);
            this.channel.ack(msg);
          } catch (error) {
            console.error('❌ Error processing message:', error);
            this.channel.nack(msg, false, true);
          }
        }
      }, { noAck: false });

      console.log(`👂 Listening on queue: ${queue}`);
    } catch (error) {
      console.error(`❌ Failed to consume:`, error);
    }
  }

  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    console.log('🔌 RabbitMQ disconnected');
  }
}

export default new RabbitMQ();