import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common'
import { DiseaseService } from './disease.service'

@Controller('disease')
export class DiseaseController {
    constructor(private readonly diseaseService: DiseaseService) {}

    @Get('all')
    async getAllDiseases() {
        return await this.diseaseService.findAllDiseases()
    }

    @Get(':id')
    async getDiseaseById(@Param('id') id: number) {
        return await this.diseaseService.findDiseaseById(id)
    }

    @Post('record')
    async createDiseaseRecord(@Body() data: any) {
        return await this.diseaseService.createDiseaseRecord(data)
    }

    @Get('record/all')
    async getAllDiseaseRecords() {
        return await this.diseaseService.findAllDiseaseRecords()
    }

    @Get('record/:id')
    async getDiseaseRecordById(@Param('id') id: number) {
        return await this.diseaseService.findDiseaseRecordById(id)
    }

    @Delete('record/:id')
    async deleteDiseaseRecord(@Param('id') id: number) {
        return await this.diseaseService.deleteDiseaseRecord(id)
    }
}
