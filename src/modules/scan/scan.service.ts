import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class ScanService {
  private pubSubClient: PubSub;
  private topicName: string = 'projects/capstone-c242-ps453/topics/process-image';
  private subscriptionName: string = 'projects/capstone-c242-ps453/subscriptions/process-image-sub';

  constructor() {
    this.pubSubClient = new PubSub();
  }

  async predictImage(imageBuffer: Buffer): Promise<string> {
    try {
      const base64Image = imageBuffer.toString('base64');
      const data = {
        image: base64Image,
        timestamp: new Date().toISOString(),
      };

      const messageBuffer = Buffer.from(JSON.stringify(data));
      const messageId = await this.pubSubClient
        .topic(this.topicName)
        .publish(messageBuffer);

      await this.subscribeToTopic();

      return `Image published with ID: ${messageId}`;
    } catch (err) {
      throw new Error(`Failed to publish image: ${err.message}`);
    }
  }

  private async subscribeToTopic(): Promise<void> {
    try {
      const subscription = this.pubSubClient.subscription(this.subscriptionName);

      const messageHandler = (message: any) => {
        console.log(`Received message: ${message.id}`);
        // console.log(`Message data: ${message.data.toString()}`);
        // console.log(`Attributes: ${JSON.stringify(message.attributes)}`);
        message.ack();
      };

      const errorHandler = (error: any) => {
        console.error(`Error: ${error}`);
      };

      subscription.on('message', messageHandler);
      subscription.on('error', errorHandler);

      setTimeout(() => {
        subscription.removeListener('message', messageHandler);
        console.log('Unsubscribed from topic after timeout.');
      }, 5000);

    } catch (err) {
      console.error(`Failed to subscribe to topic: ${err.message}`);
    }
  }
}
