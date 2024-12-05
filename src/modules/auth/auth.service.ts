import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(RefreshToken)
    private readonly RefreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async login({ username, password }: LoginDto) {
    const user = await this.userService.findByUsername(username);
    if (!user || !(await bcryptjs.compare(password, user.password)))
      throw new BadRequestException('Invalid credentials');

    const payload = { sub: user.id, username };
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const userTokens = await this.RefreshTokenRepository.find({
      where: { user: { id: user.id } },
      order: { created_at: 'DESC' },
    });

    if (userTokens.length >= 2) {
      const tokensToDelete = userTokens.slice(2).map((token) => token.id);
      if (tokensToDelete.length > 0)
        await this.RefreshTokenRepository.delete(tokensToDelete);
    }

    await this.RefreshTokenRepository.save(
      this.RefreshTokenRepository.create({
        user: { id: user.id },
        refresh_token: refreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }),
    );
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async register({ username, email, ...rest }: RegisterDto) {
    if (await this.userService.findByUsername(username))
      throw new BadRequestException('Username already exists');
    if (await this.userService.findByEmail(email))
      throw new BadRequestException('Email already exists');

    const {
      id,
      username: uname,
      email: uemail,
    } = await this.userService.create({ username, email, ...rest });
    return {
      message: 'Registration successful',
      user: { id, username: uname, email: uemail },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const { sub: userId } = this.jwtService.verify(refreshToken);
      if (!(await this.userService.findOne(userId)))
        throw new UnauthorizedException('Invalid refresh token');

      const tokenRecord = await this.RefreshTokenRepository.findOne({
        where: { refresh_token: refreshToken },
        relations: ['user'],
      });
      if (!tokenRecord || tokenRecord.expires_at < new Date()) {
        if (tokenRecord)
          await this.RefreshTokenRepository.delete(tokenRecord.id);
        throw new UnauthorizedException(
          tokenRecord ? 'Refresh token expired' : 'Invalid refresh token',
        );
      }

      return {
        access_token: this.jwtService.sign({
          sub: userId,
          username: tokenRecord.user.username,
        }),
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    const tokenRecord = await this.RefreshTokenRepository.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!tokenRecord) throw new BadRequestException('Invalid refresh token');

    await this.RefreshTokenRepository.delete({ refresh_token: refreshToken });
    return { message: 'Logged out successfully' };
  }

  async cleanup() {
    await this.RefreshTokenRepository.delete({
      expires_at: LessThan(new Date()),
    });
    return { message: 'Expired tokens cleaned up' };
  }
}