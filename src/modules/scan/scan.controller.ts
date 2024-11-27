import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ScanService } from './scan.service';

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post('predict')
  @UseInterceptors(FileInterceptor('image'))
  async predict(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No image file uploaded.');

    try {
      const result = await this.scanService.predictImage(file.buffer);
      return result;
    } catch (error) {
      throw new BadRequestException('Error processing image: ' + error.message);
    }
  }
}
