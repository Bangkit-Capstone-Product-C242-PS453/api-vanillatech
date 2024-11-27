import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [JwtModule.register({ secret: 'your-secret-key', signOptions: { expiresIn: '60s' } }), UserModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
