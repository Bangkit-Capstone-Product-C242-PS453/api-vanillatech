import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/modules/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        if (!token) throw new UnauthorizedException('Token is missing')

        try {
            const payload = this.jwtService.verify(token)
            if (!payload || !payload.sub) throw new UnauthorizedException('Invalid token payload')

            const user = await this.userService.findOne(payload.sub)
            if (!user) throw new UnauthorizedException('User not found')

            request.user = payload
            return true
        } catch {
            throw new UnauthorizedException('Invalid or expired token')
        }
    }

    private extractTokenFromHeader(request): string | null {
        const authHeader = request.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1]
        return null
    }
}
