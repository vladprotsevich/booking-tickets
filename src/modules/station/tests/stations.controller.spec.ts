import { Test } from '@nestjs/testing';
import { StationController } from '../station.controller';
import { StationService } from '../station.service';

describe('StationsController', () => {
  let stationsController: StationController;
  let stationsService: StationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [StationController],
      providers: [StationService],
    }).compile();

    stationsService = moduleRef.get<StationService>(StationService);
    stationsController = moduleRef.get<StationController>(StationController);
  });

  describe('allStations', () => {
    it('should return an array of stations', async () => {
      const result = ['test'];
      jest
        .spyOn(stationsService, 'allStations')
        .mockImplementation(() => Promise.resolve(result));

      expect(await stationsController.index()).toStrictEqual({
        stations: result,
      });
    });
  });

  // describe('createStation', () => {
  //   it('shoud create a new record', async () => {});
  // });
});
