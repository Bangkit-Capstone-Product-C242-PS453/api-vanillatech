import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common'

@Injectable()
export class GuestGuard implements CanActivate {
    constructor() { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        if (token) throw new NotFoundException('Page not found');
        return true;
    }

    private extractTokenFromHeader(request): string | null {
        const authHeader = request.headers.authorization
        if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1]
        return null
    }
}
