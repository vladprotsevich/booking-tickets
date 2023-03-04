import { ApiProperty } from '@nestjs/swagger';
import { FrequencyType } from 'src/common/enums/frequency.enum';

export class Frequencies {
  id: string;

  train_id: string;

  frequency: FrequencyType;
}
