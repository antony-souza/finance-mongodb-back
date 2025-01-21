import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { environment } from 'src/environment/environment';
import { RecoveryRepository } from './recovery.repository';
import { CreateRecoveryDto } from './dto/create-recovery.dto';
import { UpdateRecoveryDto } from './dto/update-recovery.dto';
import GeneratePasswordService from 'src/utils/hashPassword/hash-pass.service';
import { htmlRecoveryPassword } from 'src/utils/emails/html/recovery-pass-html';

@Injectable()
export class RecoveryService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly recoveryRepository: RecoveryRepository,
    private readonly generatePasswordService: GeneratePasswordService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: environment.smtpHost,
      port: environment.smtpPort,
      secure: false,
      auth: {
        user: environment.sendEmailService,
        pass: environment.sendPasswordService,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async randomCode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendCodeRecoveryByEmail(
    dto: CreateRecoveryDto,
  ): Promise<{ message: string }> {
    const checkUser = await this.recoveryRepository.findUserByEmail(dto.email);

    if (!checkUser) {
      throw new NotFoundException(
        'Usuário não encontrado em nossa base de dados',
      );
    }

    const recoveryCode = await this.randomCode();

    const saveRecoveryCodeFromDB =
      await this.recoveryRepository.saveRecoveryCode(
        checkUser._id,
        recoveryCode,
      );

    if (!saveRecoveryCodeFromDB) {
      throw new ConflictException('Erro ao salvar código de recuperação');
    }

    await this.transporter.sendMail({
      from: environment.sendEmailService,
      to: dto.email,
      subject: 'Redefinição de Senha 🔒',
      html: htmlRecoveryPassword(recoveryCode),
    });

    return {
      message: 'Código de recuperação enviado com sucesso',
    };
  }

  async validadeRecoveryCode(dto: UpdateRecoveryDto) {
    const recovery = await this.recoveryRepository.validateRecoveryCode(
      dto.recoveryCode,
    );

    if (!recovery) {
      throw new NotFoundException(
        'Código de recuperação inválido ou expirado.',
      );
    }

    return {
      message: 'Código de recuperação válido',
    };
  }

  async updatePasswordForRecovery(
    dto: UpdateRecoveryDto,
  ): Promise<{ message: string }> {
    const recovery = await this.recoveryRepository.validateRecoveryCode(
      dto.recoveryCode,
    );

    if (!recovery) {
      throw new NotFoundException(
        'Código de recuperação inválido ou expirado.',
      );
    }

    const newPassword = await this.generatePasswordService.createHash(
      dto.password,
    );

    const updatePassword =
      await this.recoveryRepository.updatePasswordForRecovery({
        _id: recovery.user,
        password: newPassword,
      });

    if (!updatePassword) {
      throw new ConflictException('Erro ao atualizar senha');
    }

    const disableRecoveryCode =
      await this.recoveryRepository.disableRecoveryCode(recovery._id);

    if (!disableRecoveryCode) {
      throw new ConflictException('Erro ao desativar código de recuperação');
    }

    return {
      message: 'Senha atualizada com sucesso',
    };
  }

  sendMail;
}
