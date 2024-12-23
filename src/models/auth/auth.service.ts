import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
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
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
