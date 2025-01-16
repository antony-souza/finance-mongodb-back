import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecoveryDto } from './dto/create-recovery.dto';

@Controller('/recovery')
export class RecoveryController {
  constructor(private readonly nodemailerService: RecoveryService) {}

  @Post('/send-code-recovery-by-email')
  @UseInterceptors(FileInterceptor(''))
  async sendCodeRecoveryByEmail(@Body() dto: CreateRecoveryDto) {
    return await this.nodemailerService.sendCodeRecoveryByEmail(dto);
  }
}
