import { Controller, Get, Param, Res } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { Response } from 'express';

@Controller('/sheets')
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Get('/generate-billing-sheet/:id')
  async generateBillingSheetByStore(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const data = await this.sheetsService.generateBillingSheetByStore(id);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment');

    return res.send(data);
  }

  @Get('/generate-sales-sheet/:id')
  async generateSalesSheetByStore(
    @Param('id') storeId: string,
    @Res() res: Response,
  ) {
    const data = await this.sheetsService.generateSalesSheetByStore(storeId);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment');

    return res.send(data);
  }
}
