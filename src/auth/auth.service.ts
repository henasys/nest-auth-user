import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signUp(authCredentialsDto: AuthCredentialsDto) {
    return this.usersService.createUser(
      authCredentialsDto.email,
      authCredentialsDto.password,
    );
  }

  async signIn(authCredentialsDto: AuthCredentialsDto) {
    const { email, password } = authCredentialsDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }
    const payload: JwtPayload = { id: user.id };
    console.log('payload', payload);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
