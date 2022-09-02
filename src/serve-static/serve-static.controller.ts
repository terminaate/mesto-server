import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import ServeStaticService from './serve-static.service';

@Controller('/static')
class ServeStaticController {

  constructor(
    private serveStaticService: ServeStaticService,
  ) {
  }

  @Get('/:path*')
  getPath(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const file = this.serveStaticService.getFile(Object.values(req.params).reverse().join(''));
    res.setHeader('Content-Type', file.type);
    res.send(file.buffer);
    res.end();
  }
}

export default ServeStaticController;
