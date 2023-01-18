import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SingInDTO {
  id?: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  token?: string;
}
