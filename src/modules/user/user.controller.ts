import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create.dto';
import { UpdateUserDto } from './dtos/update.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.userService.remove(id);
    }
}
