import { Controller, Get, Param} from '@nestjs/common'
import { DiseaseService } from './disease.service'

@Controller('diseases')
export class DiseasesController {
    constructor(private readonly diseaseService: DiseaseService) {}

    @Get()
    async getAllDiseases() {
        return await this.diseaseService.findAll()
    }

    @Get(':id')
    async getDiseaseById(@Param('id') id: number) {
        return await this.diseaseService.findDiseaseById(id)
    }
}
