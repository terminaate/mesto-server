import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import ServeStaticService from './serve-static.service';
import CustomHttpException from '../exceptions/custom-http.exception';
import ApiExceptions from '../exceptions/api.exceptions';

@Controller('/static')
class ServeStaticController {

  constructor(
    private serveStaticService: ServeStaticService,
  ) {
  }

  @Get('/:path*')
  getPath(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const file = this.serveStaticService.getFile(Object.values(req.params).reverse().join(''));

    if (!file || !file.buffer || !file.type) {
      throw new CustomHttpException(ApiExceptions.FileNotFound(), HttpStatus.BAD_REQUEST);
    }

    res.setHeader('Content-Type', file.type);
    res.send(file.buffer);
  }
}

export default ServeStaticController;
