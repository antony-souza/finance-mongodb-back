import { Body, Controller, Get } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { UpdateNodemailerDto } from './dto/update-nodemailer.dto';

@Controller('/recovery')
export class NodemailerController {
  constructor(private readonly nodemailerService: NodemailerService) {}

  @Get('/send-code-recovery-by-email')
  async sendCodeRecoveryByEmail(@Body() dto: UpdateNodemailerDto) {
    return await this.nodemailerService.sendCodeRecoveryByEmail(dto);
  }
}
