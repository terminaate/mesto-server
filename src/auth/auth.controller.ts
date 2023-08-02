import { Body, Controller, ForbiddenException, Post, Req, Res } from '@nestjs/common';
import { RegisterUserDTO } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  private refreshTokenExpires = 2592000000; // 30 day

  constructor(private authService: AuthService) {}

  @Post('login')
  public async login(@Body() userDto: LoginUserDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
    const {
      accessToken,
      refreshToken,
      user: newUser,
    } = await this.authService.login(userDto.login ? userDto.login : userDto.email, userDto.password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: this.refreshTokenExpires,
      secure: true,
      sameSite: 'none',
    });
    res.json({ accessToken, user: newUser });
  }

  @Post('register')
  public async register(@Body() userDto: RegisterUserDTO, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { accessToken, refreshToken, user: newUser } = await this.authService.register(userDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: this.refreshTokenExpires,
      secure: true,
    });
    res.json({ accessToken, user: newUser });
  }

  @Post('refresh')
  public async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: this.refreshTokenExpires,
      secure: true,
    });
    res.json({ accessToken: newAccessToken });
  }

  @Post('logout')
  public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new ForbiddenException();
    }

    await this.authService.logout(refreshToken);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      maxAge: this.refreshTokenExpires,
      secure: true,
    });
    res.end();
  }
}
