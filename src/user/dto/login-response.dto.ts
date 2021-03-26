import { User } from 'src/user/schemas/user.schema';

export class LoginResponseDto {
  access_token: string;
  user: User;
}
