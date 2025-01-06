import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Se nenhuma role for definida, permite o acesso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roleName) {
      return false; // Bloqueia o acesso se o usuário ou a role não existirem
    }

    // Verifica se o usuário possui ao menos uma das roles necessárias
    return requiredRoles.some((role) => user.roleName === role);
  }
}
