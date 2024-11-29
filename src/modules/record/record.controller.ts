import { Controller, Get, Param, Delete } from '@nestjs/common';
import { RecordService } from './record.service';

@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  async findAll() {
    return await this.recordService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.recordService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.recordService.remove(id);
  }
}
