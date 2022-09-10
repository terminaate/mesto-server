import { Controller, Get, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import ServeStaticService from './serve-static.service';
import CustomHttpException from '../exceptions/custom-http.exception';
import ApiExceptions from '../exceptions/api.exceptions';

@Controller('/static')
class ServeStaticController {
  constructor(private serveStaticService: ServeStaticService) {}

  @Get('/:path*')
  async getPath(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Query('size') size: string,
  ) {
    let file: { buffer: Buffer; type: string };

    if (Number(size)) {
      file = await this.serveStaticService.getFile(
        Object.values(req.params).reverse().join(''),
        Number(size),
      );
    } else {
      file = await this.serveStaticService.getFile(
        Object.values(req.params).reverse().join(''),
      );
    }

    if (!file || !file.buffer || !file.type) {
      throw new CustomHttpException(
        ApiExceptions.FileNotFound(),
        HttpStatus.BAD_REQUEST,
      );
    }

    res.setHeader('Content-Type', file.type);
    res.send(file.buffer);
  }
}

export default ServeStaticController;
