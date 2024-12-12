import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcryptjs from 'bcryptjs';
import { CreateUserDto } from './dtos/create.dto';
import { UpdateUserDto } from './dtos/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.userRepository.findOne({ where: { username: createUserDto.username } }))
      throw new BadRequestException('Username already exists');

    if (await this.userRepository.findOne({ where: { email: createUserDto.email } }))
      throw new BadRequestException('Email already exists');

    const user = this.userRepository.create({
      ...createUserDto,
      password: await bcryptjs.hash(createUserDto.password, 10),
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (await this.userRepository.findOne({ where: { username: updateUserDto.username, id: Not(id) } }))
      throw new BadRequestException('Username already exists');

    if (await this.userRepository.findOne({ where: { email: updateUserDto.email, id: Not(id) } }))
      throw new BadRequestException('Email already exists');

    if (updateUserDto.password)
      updateUserDto.password = await bcryptjs.hash(updateUserDto.password, 10);

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    if (!(await this.userRepository.findOne({ where: { id } })))
      throw new NotFoundException('User not found');
    await this.userRepository.delete(id);
  }
}
