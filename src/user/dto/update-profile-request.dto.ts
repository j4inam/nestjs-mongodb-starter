import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class UpdateProfileRequestDto {
  @IsNotEmpty()
  @IsOptional()
  firstName: string;

  @IsNotEmpty()
  @IsOptional()
  lastName: string;

  @IsNotEmpty()
  @IsOptional()
  @Length(10, 10, {
    message: 'Mobile must have 10 digits',
  })
  mobile: string;
}
