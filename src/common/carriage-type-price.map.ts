import { CarriageEnum } from './enums/carriage.enum';

export const PriceEnum: { [carriageType in CarriageEnum]: number } = {
  [CarriageEnum.couple]: 150,
  [CarriageEnum.reserved]: 75,
  [CarriageEnum.luxury]: 350,
};
