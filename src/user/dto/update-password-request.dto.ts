import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdatePasswordRequestDto {
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
