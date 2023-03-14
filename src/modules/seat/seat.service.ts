import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { dbConf } from 'src/db/knexfile';
import { ArrivalService } from '../arrival/arrival.service';
import { CreateSeatDTO } from './dto/create-seat.dto';
import { Seat } from './models/seat.model';
import { SearchOccupiedSeats } from './models/search-occupied-seats';
import { SearchTrainSeatsQueryDTO } from '../train/dto/search-available-seats.dto';
import { SearchAvailableTrainsQueryDTO } from '../train/dto/search-available-trains.dto';

@Injectable()
export class SeatService {
  constructor(private readonly arrivalService: ArrivalService) {}

  private qb() {
    return dbConf<Seat>('seats');
  }

  async create(body: CreateSeatDTO, trx: Knex.Transaction) {
    try {
      const [seat] = await this.qb()
        .transacting(trx)
        .insert(body)
        .returning('*');
      return seat;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot create a seat with invalid data',
      });
    }
  }

  async createSeatsCollection(
    amount: number,
    carriage_id: string,
    trx: Knex.Transaction,
  ) {
    const seats = [];
    for (let i = 1; i < amount + 1; i++) {
      seats.push(this.create({ number: i, carriage_id }, trx));
    }
    return Promise.all<Seat>(seats);
  }

  async findAvailableSeats(
    query: SearchTrainSeatsQueryDTO | SearchAvailableTrainsQueryDTO,
    route_id: string,
    limit: boolean,
  ) {
    const departureOrder = await this.arrivalService.getCurrentStationOrder(
      route_id,
      query.departureStation,
    );
    const arrivalOrder = await this.arrivalService.getCurrentStationOrder(
      route_id,
      query.arrivalStation,
    );
    const args: SearchOccupiedSeats = {
      departureOrder: departureOrder,
      arrivalOrder: arrivalOrder,
      departure_date: query.departureDate,
      train_id: query.train_id,
      route_id: route_id,
    };
    const occupiedSeats = await this.getUnAvailableSeats(args);
    return this.getAvailableSeats(query.train_id, occupiedSeats, limit);
  }

  async getUnAvailableSeats(args: SearchOccupiedSeats) {
    const [departureStations, arrivalStations] = await Promise.all([
      this.arrivalService.findArrivalStations(args, args.arrivalOrder, true),
      this.arrivalService.findArrivalStations(args, args.departureOrder, false),
    ]);
    try {
      const occupiedSeats: Pick<Seat, 'id'>[] = await this.qb()
        .distinct('seats.id')
        .innerJoin('tickets', 'tickets.seat_id', '=', 'seats.id')
        .where({ departure_date: args.departure_date })
        .andWhere({ train_id: args.train_id })
        .whereIn('departure_station', departureStations)
        .whereIn('arrival_station', arrivalStations);
      return occupiedSeats;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Not Found', {
        description: 'Cannot find the unavailable seats with the wrong data',
      });
    }
  }

  async getAvailableSeats(
    train_id: string,
    unAvailableSeats: Pick<Seat, 'id'>[],
    limit: boolean,
  ) {
    const occupiedSeats = unAvailableSeats.map((seat) => seat.id);
    try {
      const query = this.qb();
      limit ? query.distinct('train_id') : query.select('seats.*');
      const seats: Seat[] = await query
        .innerJoin('carriages', 'carriages.id', '=', 'seats.carriage_id')
        .where('carriages.train_id', train_id)
        .whereNotIn('seats.id', occupiedSeats);
      return seats;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Not Found', {
        description:
          'Cannot find any available seats with invalid the wrong data',
      });
    }
  }
}
