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

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 10px 0;
          }
          .header h1 {
            color: #333333;
          }
          .content {
            padding: 20px 0;
            text-align: center;
          }
          .content p {
            color: #555555;
            font-size: 16px;
            line-height: 1.5;
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
            color: #aaaaaa;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Redefinição de Senha</h1>
          </div>
          <div class="content">
            <p>Recebemos uma solicitação para redefinir sua senha. Use o código abaixo para redefini-la:</p>
            <div class="code">${recoveryCode}</div>
            <p>O código é válido durante 10 minutos.</p>
            <p>Se você não solicitou isso, pode ignorar este e-mail.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 DuckEnterprise. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: environment.sendEmailService,
      to: dto.email,
      subject: 'Redefinição de Senha 🔒',
      html: htmlContent,
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
}
