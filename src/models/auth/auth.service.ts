import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthRepository } from 'src/repositories/auth.repository';
import { JwtAuthService } from 'src/middleware/jwt.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtAuthService,
  ) {}

  async authUser(createAuthDto: CreateAuthDto) {
    const user = await this.authRepository.authUser(createAuthDto.email);

    if (!user) {
      throw new ConflictException('Usuário não encontrado');
    }

    if (
      !user.password ||
      !(await bcrypt.compare(createAuthDto.password, user.password))
    ) {
      throw new ConflictException('Password is incorrect');
    }

    const token = await this.jwtService.generateToken({
      id: user._id,
    });

    return {
      access_token: token,
      user: {
        name: user.name,
        image_url: user.image_url,
        store_id: user.store,
        role: user.roleName,
        id: user._id,
      },
    };
  }
}
