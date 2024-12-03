import { Injectable } from '@nestjs/common';
import { PubSub } from '@google-cloud/pubsub';
import { RecordService } from '../record/record.service';
import { DiseaseService } from '../diseases/disease.service';

@Injectable()
export class ScanService {
  private pubSubClient: PubSub;
  private topicName: string =
    'projects/capstone-c242-ps453/topics/process-image';
  private subscriptionName: string =
    'projects/capstone-c242-ps453/subscriptions/result-image-sub';

  constructor(
    private readonly recordService: RecordService,
    private readonly diseaseService: DiseaseService,
  ) {
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

      const result = (await this.subscribeToTopic(messageId)).result;
      const record = await this.recordService.create({
        id_user: null,
        image: null,
      });
      await this.linkDiseasesToRecord(record, result);
      return this.recordService.findOne(record.id);
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
        }, 20000);
      } catch (err) {
        reject(new Error(`Failed to subscribe to topic: ${err.message}`));
      }
    });
  }

  private async linkDiseasesToRecord(record: any, result: any): Promise<void> {
    const sortedDiseases = Object.entries(result)
      .sort(
        ([, scoreA]: [string, number], [, scoreB]: [string, number]) =>
          scoreB - scoreA,
      )
      .slice(0, 3);

    for (const [diseaseName] of sortedDiseases) {
      const disease = await this.diseaseService.findDiseaseByName(diseaseName);
      if (disease)
        await this.diseaseService.createDiseaseRecord({
          record: record,
          disease: disease,
        });
    }
  }
}
