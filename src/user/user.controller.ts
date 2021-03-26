import {
  Body,
  Request,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Put,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthData } from './schemas/auth-data.schema';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePasswordRequestDto } from './dto/update-password-request.dto';
import { UpdateProfileRequestDto } from './dto/update-profile-request.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    const user: User = await this.userService.findOne(registerUserDto.email);
    if (user) {
      throw new HttpException(
        'Email already registered! Try logging in.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const encryptedPassword = await this.userService.getEncryptedPassword(
      registerUserDto.password,
    );

    const authData: AuthData = await this.userService.createAuthData(
      encryptedPassword,
    );

    registerUserDto.encryptedPassword = authData;

    return this.userService.register(registerUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Request() req): Promise<LoginResponseDto> {
    return this.userService.getAccessToken(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/account/update-profile')
  async updateUserProfile(
    @Request() req,
    @Body() updateProfileRequestDto: UpdateProfileRequestDto,
  ) {
    return this.userService.updateUserProfile(
      req.user._id,
      updateProfileRequestDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/account/update-password')
  async updateUserPassword(
    @Request() req,
    @Body() updatePasswordRequestDto: UpdatePasswordRequestDto,
  ): Promise<Boolean> {
    const encryptedPassword = await this.userService.getEncryptedPassword(
      updatePasswordRequestDto.password,
    );

    return this.userService.updateUserPassword(req.user._id, encryptedPassword);
  }
}
