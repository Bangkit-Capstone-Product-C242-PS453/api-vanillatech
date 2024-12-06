import { Injectable } from '@nestjs/common'
import { PubSub } from '@google-cloud/pubsub'
import { Storage } from '@google-cloud/storage'
import { RecordService } from '../record/record.service'
import { DiseaseService } from '../diseases/disease.service'

@Injectable()
export class ScanService {
  private pubSubClient = new PubSub()
  private storageClient = new Storage()
  private topicName = 'projects/capstone-c242-ps453/topics/process-image'
  private subscriptionName = 'projects/capstone-c242-ps453/subscriptions/result-image-sub'
  private bucketName = 'predict-images'

  constructor(
    private readonly recordService: RecordService,
    private readonly diseaseService: DiseaseService
  ) {}

  async predictImage(imageBuffer: Buffer, request: any): Promise<any> {
    try {
      const messageId = await this.pubSubClient
        .topic(this.topicName)
        .publish(Buffer.from(JSON.stringify({
          image: imageBuffer.toString('base64'),
          timestamp: new Date().toISOString()
        })))

      const result = (await this.subscribeToTopic(messageId)).result
      const gcsUrl = await this.uploadToGCS(imageBuffer, `${request.user.sub + Date.now()}.jpg`)
      const record = await this.recordService.create({ id_user: request.user.sub, image: gcsUrl })

      await this.linkDiseasesToRecord(record, result)
      return this.recordService.findOne(record.id)
    } catch (err) {
      throw new Error(`Failed to process image: ${err.message}`)
    }
  }

  private async uploadToGCS(buffer: Buffer, destination: string): Promise<string> {
    try {
      await this.storageClient.bucket(this.bucketName).file(destination).save(buffer, {
        resumable: false, contentType: 'image/jpeg', public: true
      })
      return `https://storage.googleapis.com/${this.bucketName}/${destination}`
    } catch (err) {
      throw new Error(`Failed to upload image to GCS: ${err.message}`)
    }
  }

  private async subscribeToTopic(messageId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const subscription = this.pubSubClient.subscription(this.subscriptionName)
        const messageHandler = (message: any) => {
          const data = JSON.parse(message.data)
          if (data.id_process === messageId) {
            message.ack()
            resolve(data)
            subscription.removeListener('message', messageHandler)
          }
        }
        subscription.on('message', messageHandler)
        subscription.on('error', (error) => reject(error))
        setTimeout(() => {
          subscription.removeListener('message', messageHandler)
          reject(new Error('Subscription timed out.'))
        }, 20000)
      } catch (err) {
        reject(new Error(`Failed to subscribe to topic: ${err.message}`))
      }
    })
  }

  private async linkDiseasesToRecord(record: any, result: any): Promise<void> {
    for (const [diseaseName] of Object.entries(result)
      .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
      .slice(0, 3)) {
      const disease = await this.diseaseService.findDiseaseByName(diseaseName)
      if (disease)
        await this.diseaseService.createDiseaseRecord({ record, disease })
    }
  }
}
