import { IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly surname: string;

  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  public password: string;
}
