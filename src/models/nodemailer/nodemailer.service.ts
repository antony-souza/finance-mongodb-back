import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { environment } from 'src/environment/environment';
import { UpdateNodemailerDto } from './dto/update-nodemailer.dto';

@Injectable()
export class NodemailerService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: environment.smtpService,
      port: environment.smtpPort,
      secure: false,
      auth: {
        user: environment.sendEmailService,
        pass: environment.sendPasswordService,
      },
    });
  }

  async randomCode(): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendCodeRecoveryByEmail(dto: UpdateNodemailerDto): Promise<string> {
    return await this.transporter.sendMail({
      from: dto.email,
      to: environment.sendEmailService,
      subject: 'Recovery Password 🔒',
      text: `Seu código de recuperação é: ${this.randomCode()}`,
    });
  }
}
