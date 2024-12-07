import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ScanService } from './scan.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async predict(@Req() request, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No image file uploaded.');

    try {
      const result = await this.scanService.predictImage(file.buffer, request);
      return result;
    } catch (error) {
      throw new BadRequestException('Error processing image: ' + error.message);
    }
  }
}
