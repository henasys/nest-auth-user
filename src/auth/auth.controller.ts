import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { Serialize } from 'src/serialize.interceptor';
import { AuthResultDto } from 'src/auth/dto/auth-result.dto';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@Serialize(AuthResultDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@GetUser() user: User) {
    return user;
  }
}
