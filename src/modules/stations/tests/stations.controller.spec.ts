import { Test } from '@nestjs/testing';
import { StationsController } from '../stations.controller';
import { StationsService } from '../stations.service';

describe('StationsController', () => {
  let stationsController: StationsController;
  let stationsService: StationsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [StationsController],
      providers: [StationsService],
    }).compile();

    stationsService = moduleRef.get<StationsService>(StationsService);
    stationsController = moduleRef.get<StationsController>(StationsController);
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
