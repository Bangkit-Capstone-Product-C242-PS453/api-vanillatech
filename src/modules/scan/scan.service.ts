import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';

@Injectable()
export class ScanService {
  private pubSubClient: PubSub;
  private topicName: string =
    'projects/capstone-c242-ps453/topics/process-image';
  private subscriptionName: string =
    'projects/capstone-c242-ps453/subscriptions/result-image-sub';

  constructor() {
    this.pubSubClient = new PubSub();
  }

  async predictImage(imageBuffer: Buffer): Promise<any> {
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

      return await this.subscribeToTopic(messageId);

    } catch (err) {
      throw new Error(`Failed to publish image: ${err.message}`);
    }
  }

  private async subscribeToTopic(messageId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const subscription = this.pubSubClient.subscription(
          this.subscriptionName,
        );

        const messageHandler = (message: any) => {
          const data = JSON.parse(message.data);

          if (data.id_process === messageId) {
            message.ack();
            resolve(data);
            subscription.removeListener('message', messageHandler);
          }
        };

        const errorHandler = (error: any) => {
          console.error(`Error: ${error}`);
          reject(error);
        };

        subscription.on('message', messageHandler);
        subscription.on('error', errorHandler);

        setTimeout(() => {
          subscription.removeListener('message', messageHandler);
          reject(new Error('Subscription timed out.'));
        }, 10000);
      } catch (err) {
        reject(new Error(`Failed to subscribe to topic: ${err.message}`));
      }
    });
  }
}
