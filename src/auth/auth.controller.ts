import { Body, Controller, ForbiddenException, Post, Req, Res } from '@nestjs/common';
import { RegisterUserDTO } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginUserDTO } from './dto/login-user.dto';
const ms = require('ms');

@Controller('auth')
export class AuthController {
  private REFRESH_TOKEN_EXPIRES = ms(process.env.JWT_REFRESH_LIFE_TIME);
  private ACCESS_TOKEN_EXPIRES = ms(process.env.JWT_ACCESS_LIFE_TIME);

  constructor(private authService: AuthService) {}

  @Post('login')
  public async login(@Body() userDto: LoginUserDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { accessToken, refreshToken, user } = await this.authService.login(userDto.login ? userDto.login : userDto.email, userDto.password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_EXPIRES,
      secure: true,
      sameSite: 'none',
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: this.ACCESS_TOKEN_EXPIRES,
      secure: true,
      sameSite: 'none',
    });
    res.json(user);
  }

  @Post('register')
  public async register(@Body() userDto: RegisterUserDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { accessToken, refreshToken, user } = await this.authService.register(userDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_EXPIRES,
      secure: true,
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: this.ACCESS_TOKEN_EXPIRES,
      secure: true,
      sameSite: 'none',
    });
    res.json(user);
  }

  @Post('refresh')
  public async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { refreshToken, accessToken } = req.cookies;
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.authService.refresh(refreshToken, accessToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_EXPIRES,
      secure: true,
    });
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      maxAge: this.ACCESS_TOKEN_EXPIRES,
      secure: true,
      sameSite: 'none',
    });
    res.end();
  }

  @Post('logout')
  public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { refreshToken, accessToken } = req.cookies;
    if (!refreshToken || !accessToken) {
      throw new ForbiddenException();
    }

    await this.authService.logout(refreshToken, accessToken);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      maxAge: this.REFRESH_TOKEN_EXPIRES,
      secure: true,
    });
    res.clearCookie('accessToken', {
      httpOnly: true,
      maxAge: this.ACCESS_TOKEN_EXPIRES,
      secure: true,
      sameSite: 'none',
    });
    res.end();
  }
}
