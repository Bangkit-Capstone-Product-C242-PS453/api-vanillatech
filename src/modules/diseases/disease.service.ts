import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disease } from './entities/diseases.entity';

@Injectable()
export class DiseaseService {
    constructor(
        @InjectRepository(Disease)
        private readonly userRepository: Repository<Disease>,
    ) { }
    
    async findAll(): Promise<Disease[]> {
        return this.userRepository.find();
    }

    async findOne(id: number): Promise<Disease> {
        return this.userRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
