import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class SearchTrainsByParamsDTO {
  @ValidateIf((x) => x.departureStation || x.arrivalStation || x.departureDate)
  @IsNotEmpty()
  departureStation: string;

  @ValidateIf((x) => x.departureStation || x.arrivalStation || x.departureDate)
  @IsNotEmpty()
  arrivalStation: string;

  @ValidateIf((x) => x.departureStation || x.arrivalStation || x.departureDate)
  @IsNotEmpty()
  departureDate: string;

  @ValidateIf((x) => x.departureStation && x.arrivalStation && x.departureDate)
  @IsOptional()
  trainUUID: string;
}
