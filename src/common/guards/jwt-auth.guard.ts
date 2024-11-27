import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        if (!token) throw new UnauthorizedException('Token is missing')

        try {
            const payload = this.jwtService.verify(token)
            request.user = payload
        } catch {
            throw new UnauthorizedException('Invalid token')
        }

        return true
    }

    private extractTokenFromHeader(request): string | null {
        const authHeader = request.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1]
        return null
    }
}
