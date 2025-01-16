import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { UpdateNodemailerDto } from './dto/update-nodemailer.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/recovery')
export class RecoveryController {
  constructor(private readonly nodemailerService: RecoveryService) {}

  @Post('/send-code-recovery-by-email')
  @UseInterceptors(FileInterceptor(''))
  async sendCodeRecoveryByEmail(@Body() dto: UpdateNodemailerDto) {
    return await this.nodemailerService.sendCodeRecoveryByEmail(dto);
  }
}
