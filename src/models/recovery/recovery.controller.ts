import { Body, Controller, Post, Put, UseInterceptors } from '@nestjs/common';
import { RecoveryService } from './recovery.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateRecoveryDto } from './dto/create-recovery.dto';
import { UpdateRecoveryDto } from './dto/update-recovery.dto';

@Controller('/recovery')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Post('/send-code-recovery-by-email')
  @UseInterceptors(FileInterceptor(''))
  async sendCodeRecoveryByEmail(@Body() dto: CreateRecoveryDto) {
    return await this.recoveryService.sendCodeRecoveryByEmail(dto);
  }

  @Post('/validate-recovery-code')
  @UseInterceptors(FileInterceptor(''))
  async validateRecoveryCode(@Body() dto: UpdateRecoveryDto) {
    return await this.recoveryService.validadeRecoveryCode(dto);
  }

  @Put('/update-password-for-recovery')
  @UseInterceptors(FileInterceptor(''))
  async updatePasswordForRecovery(@Body() dto: UpdateRecoveryDto) {
    return await this.recoveryService.updatePasswordForRecovery(dto);
  }
}
