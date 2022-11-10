import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import RegisterUserDto from './dto/register-user.dto';
import AuthService from './auth.service';
import { Request, Response } from 'express';
import LoginUserDto from './dto/login-user.dto';

@Controller('auth')
class AuthController {
  private refreshTokenExpires = 2592000000; // 30 day

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() userDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      accessToken,
      refreshToken,
      user: newUser,
    } = await this.authService.login(
      userDto.login ? userDto.login : userDto.email,
      userDto.password,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: this.refreshTokenExpires,
      sameSite: 'none',
      secure: true,
    });
    res.json({ accessToken, user: newUser });
  }

  @Post('register')
  async register(
    @Body() userDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const {
      accessToken,
      refreshToken,
      user: newUser,
    } = await this.authService.register(userDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: this.refreshTokenExpires,
      sameSite: 'none',
    });
    res.json({ accessToken, user: newUser });
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies;
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: this.refreshTokenExpires,
      sameSite: 'none',
    });
    res.json({ accessToken: newAccessToken });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new ForbiddenException();
    }
    await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      maxAge: this.refreshTokenExpires,
      sameSite: 'none',
    });
    res.end();
  }
}

export default AuthController;
