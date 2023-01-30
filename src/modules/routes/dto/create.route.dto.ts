import { IsNotEmpty } from 'class-validator';

export class CreateRouteDTO {
  @IsNotEmpty()
  name: string;

  trains: string[];
}
