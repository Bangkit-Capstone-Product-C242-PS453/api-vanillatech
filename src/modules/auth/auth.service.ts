import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    async login(loginDto: LoginDto) {
        const user = await this.userService.findByUsername(loginDto.username);
        if (!user) throw new BadRequestException('Invalid credentials');

        const isPasswordValid = await bcryptjs.compare(loginDto.password, user.password);
        if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

        const payload = { sub: user.id, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userService.findByUsername(registerDto.username);
        if (existingUser) throw new BadRequestException('Username already exists');

        const existingEmail = await this.userService.findByEmail(registerDto.email);
        if (existingEmail) throw new BadRequestException('Email already exists');

        const user = await this.userService.create(registerDto);
        return {
            message: 'Registration successful',
            user: { id: user.id, username: user.username, email: user.email },
        };
    }
}
