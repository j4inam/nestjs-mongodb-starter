import {
  IsEmail,
  IsNotEmpty,
  Length,
  MaxLength,
  MinLength,
  minLength,
} from 'class-validator';
import { Match } from 'src/validators/match.decorator';
import { AuthData } from '../schemas/auth-data.schema';

export class RegisterUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;

  @IsNotEmpty()
  @Length(10, 10, {
    message: 'Mobile must have 10 digits',
  })
  mobile: string;

  encryptedPassword?: AuthData;
}
