import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { AuthRepository } from 'src/models/auth/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { environment } from 'src/environment/environment';
import { JwtAuthService } from 'src/middleware/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: environment.secreatKey,
      signOptions: { expiresIn: '3h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtAuthService],
  exports: [JwtAuthService],
})
export class AuthModule {}
