import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/dtos/update.dto';
import { GuestGuard } from 'src/common/guards/guest.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(GuestGuard)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('cleanup')
  async cleanup() {
    return this.authService.cleanup();
  }

  @UseGuards(AuthGuard)
  @Get('user')
  async getAuthenticatedUser(@Req() req) {
    return await this.userService
      .findOne(req.user.sub)
      .then(({ id, username, email, name, address, phone }) => ({
        session: req.user,
        profile: {
          id,
          username,
          email,
          name,
          address,
          phone,
        },
      }));
  }

  @UseGuards(AuthGuard)
  @Put('user/update')
  async update(@Req() request, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(request.user.sub, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete('user/delete')
  async remove(@Req() request) {
    const user = await this.userService.findOne(request.user.sub);
    await this.userService.remove(request.user.sub);
    return { message: 'User deletion successfuly', user: user };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }
}
