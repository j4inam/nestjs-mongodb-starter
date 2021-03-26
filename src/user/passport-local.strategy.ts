import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Injectable()
export class PasspoprtLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<User> {
    const user: User = await this.userService.findOne(username);
    if (!user) {
      throw new HttpException(
        'Login Failed! Email or password may be incorrect.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid: boolean = await this.userService.verifyPassword(
      password,
      user.encryptedPassword.encryptedPassword,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Login Failed! Email or password may be incorrect.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
