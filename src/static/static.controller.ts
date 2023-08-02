import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { File, StaticService } from './static.service';
import { StaticException } from './static.exception';

@Controller('/static')
export class StaticController {
  constructor(private serveStaticService: StaticService) {}

  @Get('/:path*')
  public async getPath(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Query('size') size: string): Promise<void> {
    const filePath = Object.values(req.params).reverse().join('');
    const file: File = await this.serveStaticService.getFile(filePath, !Number.isNaN(Number(size)) ? Number(size) : undefined);

    if (!file || !file.buffer || !file.type) {
      throw StaticException.FileNotFound();
    }

    res.setHeader('Content-Type', file.type);
    res.send(file.buffer);
  }
}
