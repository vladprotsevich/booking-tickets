import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly token: string;
}
