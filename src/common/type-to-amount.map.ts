import { CarriageEnum } from 'src/common/enums/carriage.enum';

export const TypeToAmount: { [key in CarriageEnum]: number } = {
  [CarriageEnum.reserved]: 30,
  [CarriageEnum.couple]: 20,
  [CarriageEnum.luxury]: 10,
};
