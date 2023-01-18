import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SignUpDTO {
  id?: number;

  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  token?: string;
}
