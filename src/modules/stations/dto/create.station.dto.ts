import { IsNotEmpty } from 'class-validator';

export class CreateStationDTO {
  @IsNotEmpty()
  name: string;
}
