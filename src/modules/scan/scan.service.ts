import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ScanService {
  private apiUrl: string;
  private secretKey: string;

  constructor(private configService: ConfigService) {
    const mlUrl = this.configService.get<string>('ML_URL');
    if (!mlUrl) throw new Error('ML_URL environment variable is not defined');
    this.apiUrl = `${mlUrl}/predict`;

    this.secretKey = this.configService.get<string>('SECRET_TOKEN');
    if (!this.secretKey)
      throw new Error('SECRET_TOKEN environment variable is not defined');
  }

  async predictImage(imageBuffer: Buffer): Promise<any> {
    try {
      const base64Image = imageBuffer.toString('base64');
      const data = {
        image: base64Image,
        timestamp: new Date().toISOString(),
      };

      const response = await axios.post(this.apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.secretKey}`,
        },
      });
      return response.data;
    } catch (err) {
      throw new Error(`Failed to predict image: ${err.message}`);
    }
  }
}
