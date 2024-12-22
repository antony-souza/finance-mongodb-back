import { JwtService } from '@nestjs/jwt';
import { environment } from 'src/environment/environment';

export class JwtAuthService {
  constructor(private jwt: JwtService) {}

  async generateToken(payload: any) {
    return this.jwt.sign(payload, { secret: environment.secreatKey });
  }

  async verify(token: string) {
    return this.jwt.verify(token, { secret: environment.secreatKey });
  }
}
