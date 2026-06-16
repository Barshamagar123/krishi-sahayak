// auth-service/src/services/eventPublisher.ts
import rabbitMQ from './rabbitmq';

export class EventPublisher {
  async publishUserCreated(userId: string, phone: string): Promise<void> {
    const event = {
      userId,
      phone,
      timestamp: new Date().toISOString(),
      eventType: 'USER_CREATED'
    };
    
    await rabbitMQ.publish('user.created', event);
    console.log(`📤 Published user.created event for ${userId}`);
  }
}

export default new EventPublisher();