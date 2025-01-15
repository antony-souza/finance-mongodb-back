import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { UpdateNodemailerDto } from './dto/update-nodemailer.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/recovery')
export class NodemailerController {
  constructor(private readonly nodemailerService: NodemailerService) {}

  @Post('/send-code-recovery-by-email')
  @UseInterceptors(FileInterceptor(''))
  async sendCodeRecoveryByEmail(@Body() dto: UpdateNodemailerDto) {
    return await this.nodemailerService.sendCodeRecoveryByEmail(dto);
  }
}
