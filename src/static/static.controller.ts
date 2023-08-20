import { Controller, Get, ParseIntPipe, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StaticService, StaticServiceFile } from './static.service';

@Controller('/static')
export class StaticController {
  constructor(private serveStaticService: StaticService) {}

  @Get('/:path*')
  public async getPath(@Res({ passthrough: true }) res: Response, @Req() req: Request, @Query('size', ParseIntPipe) size: number): Promise<void> {
    const filePath = Object.values(req.params).reverse().join('');
    const file: StaticServiceFile = await this.serveStaticService.getFile(filePath, size || undefined);

    // if (!file || !file.buffer || !file.type) {
    //   throw StaticException.FileNotFound();
    // }

    res.setHeader('Content-Type', file.type);
    res.send(file.buffer);
  }
}
