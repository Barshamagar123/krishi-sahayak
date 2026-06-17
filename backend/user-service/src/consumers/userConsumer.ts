import rabbitMQ from '../services/rabbitmq.js';
import prisma from '../config/database.js';

class UserConsumer {
  async start(): Promise<void> {
    await rabbitMQ.consume('user.created', async (message) => {
      console.log('📥 Received user.created:', message);

      const { userId, phone } = message;

      await prisma.user.upsert({
        where: { id: userId },
        update: { phone },
        create: {
          id: userId,
          phone,
          language: 'ne',
          isActive: true
        }
      });

      console.log(`✅ User ${userId} synced to user service`);
    });
  }
}

export default new UserConsumer();