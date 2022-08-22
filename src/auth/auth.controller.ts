import { Body, Controller, Post, Res } from '@nestjs/common';
import AuthUserDto from './dto/auth-user.dto';
import AuthService from './auth.service';
import { Response } from 'express';

@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('login')
  async login(@Body() userDto: AuthUserDto, @Res() res: Response) {
    const {
      accessToken,
      refreshToken,
      user: newUser,
    } = await this.authService.login(
      userDto.username ? userDto.username : userDto.email,
      userDto.password,
    );
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.json({ accessToken, user: newUser });
  }

  @Post('register')
  async register(@Body() userDto: AuthUserDto, @Res() res: Response) {
    const {
      accessToken,
      refreshToken,
      user: newUser,
    } = await this.authService.register(userDto);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.json({ accessToken, user: newUser });
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string, @Res() res: Response) {
    const {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.json({ accessToken: newAccessToken });
  }
}

export default AuthController;
