import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { RecordService } from './record.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  async findAll() {
    return await this.recordService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.recordService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.recordService.remove(id);
  }
}
