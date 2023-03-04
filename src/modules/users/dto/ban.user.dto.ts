import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BanUser {
  @ApiProperty()
  @IsNotEmpty()
  readonly user_id: string;
}
