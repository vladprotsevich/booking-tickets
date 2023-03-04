import { CarriageType } from 'src/common/enums/carriage.type.enum';

export const TypeToAmount: { [key in CarriageType]: number } = {
  [CarriageType.reserved]: 30,
  [CarriageType.couple]: 20,
  [CarriageType.luxury]: 10,
};
