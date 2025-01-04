import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Validate JWT_SECRET on guard initialization
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      this.logger.error('JWT_SECRET is not configured');
      throw new Error('JWT configuration is missing');
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      this.logger.debug('Attempting to verify JWT token');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: secret,
      });

      this.logger.debug('JWT token verified successfully');
      request.user = payload;
    } catch (error) {
      this.logger.error(
        `JWT verification failed: ${error.message}`,
        error.stack,
      );

      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token inválido o manipulado');
      } else if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Sesión expirada');
      }

      throw new UnauthorizedException('Error de autenticación');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
