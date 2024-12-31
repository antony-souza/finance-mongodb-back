import { Controller, Get, Param, Res } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { Response } from 'express';

@Controller('/sheets')
export class SheetsController {
  constructor(private readonly sheetsService: SheetsService) {}

  @Get('/generate-all-products/:id')
  async generateProductsSheets(@Param('id') id: string, @Res() res: Response) {
    const data = await this.sheetsService.generateProductSheets(id);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="products-${id}.xlsx"`,
    );

    return res.send(data);
  }
}
