import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { environment } from 'src/environment/environment';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload, { secret: environment.secreatKey });
  }

  async verify(token: string) {
    return this.jwtService.verify(token, {
      secret: environment.secreatKey,
    });
  }
}
