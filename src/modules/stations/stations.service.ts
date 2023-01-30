import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { dbConf } from 'src/db/knexfile';
import { CreateStationDTO } from './dto/create.station.dto';
import { StationDTO } from './dto/station.dto';

@Injectable()
export class StationsService {
  async allStations() {
    return await dbConf('stations').select('*');
  }

  async createStation(body: CreateStationDTO) {
    try {
      return await dbConf('stations').insert(body).returning('*');
    } catch {
      throw new ForbiddenException('Forbidden', {
        cause: new Error(),
        description: 'Cannot create a station with invalid data',
      });
    }
  }

  async updateStation(body: StationDTO) {
    try {
      return await dbConf('stations')
        .where('id', body.id)
        .update(body)
        .returning('*');
    } catch {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: 'Cannot update the station with invalid data',
      });
    }
  }

  async findStationBy(attr: string, attrValue: string | number) {
    try {
      return await dbConf('stations')
        .where(attr, attrValue)
        .returning('*')
        .first();
    } catch {
      throw new NotFoundException('Not found', {
        cause: new Error(),
        description:
          'The record cannot be found in database with invalid received data',
      });
    }
  }
}
