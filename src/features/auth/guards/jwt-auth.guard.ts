import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext, CanActivate } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      const decoded = await this.jwtService.decode(token);
      request.email = decoded.email;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authHeader = request.headers['authorization'];
    return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
  }
}
