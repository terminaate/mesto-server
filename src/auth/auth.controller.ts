import { Body, Controller, Post } from '@nestjs/common';
import AuthUserDto from './dto/auth-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @Post('login')
  login(@Body() userDto: AuthUserDto) {
    return this.authService.login(userDto.username ? userDto.username : userDto.email, userDto.password);
  }

  @Post('register')
  register(@Body() userDto: AuthUserDto) {
    return this.authService.register(userDto);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refresh(refreshToken);
  }
}
