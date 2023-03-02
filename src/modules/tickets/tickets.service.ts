import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Knex } from 'knex';
import { TicketStatus } from 'src/common/enums/states.enum';
import { Trains } from 'src/common/enums/trains.enum';
import { dbConf } from 'src/db/knexfile';
import { ArrivalsService } from '../arrivals/arrivals.service';
import { CarriagesService } from '../carriages/carriages.service';
import { CarriageDTO } from '../carriages/dto/carriage.dto';
import { SeatsService } from '../carriages/seats.service';
import { DatabaseService } from '../database/database.service';
import { TrainDTO } from '../trains/dto/train.dto';
import { SearchTrainsByParamsDTO } from '../trains/dto/search.trains.by.params.dto';
import { TrainsService } from '../trains/trains.service';
import { SanitizedUser } from '../users/dto/user.sanitized.dto';
import { CreateTicketDTO } from './dto/create.ticket.dto';
import { BuyTicketDTO } from './dto/ticket.buy.dto';
import { PricesService } from './prices.service';
import { BookTicketDTO } from './dto/ticket.book.dto';

@Injectable()
export class TicketsService {
  constructor(
    private readonly arrivalsService: ArrivalsService,
    private readonly trainsService: TrainsService,
    private readonly seatsService: SeatsService,
    private readonly pricesService: PricesService,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(body: BuyTicketDTO, trx: Knex.Transaction) {
    return this.databaseService.createObj('tickets', body, trx);
  }

  async bookTicket(body: BookTicketDTO, user: SanitizedUser) {
    await this.checkBookingValidity(body.departure_date);

    return this.createTicket(body, user.id, TicketStatus.booked);
  }

  async buyTicket(body: BuyTicketDTO, user: SanitizedUser) {
    return this.createTicket(body, user.id, TicketStatus.unavailable);
  }

  async checkBookingValidity(departureDate: string) {
    const currentTime = new Date();
    const departureTime = new Date(departureDate);
    const future = new Date(
      new Date(new Date()).setDate(currentTime.getDate() + 3),
    );

    departureTime.setHours(0, 0, 0);
    future.setHours(0, 0, 0);

    if (departureTime > future) {
      throw new Error(
        'You cannot book a ticket later than 3 days from the train departure',
      );
    }
  }

  async createTicket(
    body: BuyTicketDTO,
    userUUID: string,
    status: TicketStatus,
  ) {
    await this.ticketValidation(body);
    body.status = status;
    body.user_id = userUUID;
    const trx = await dbConf.transaction();
    const train = await this.trainsService.findOne({ id: body.train_id });
    const ticket = await this.create(body, trx);
    const price = await this.pricesService.createTicketsPrice(
      body.departure_station,
      body.arrival_station,
      body.carriage_id,
      ticket[0].id,
      train,
      trx,
    );
    trx.commit();
    return { ticket: ticket, price };
  }

  async ticketValidation(body: BuyTicketDTO) {
    const train = await this.trainsService.findOne({
      id: body.train_id,
    });
    await this.checkTrainsFrequency(body.departure_date, train.id); // First validation. It checks if a train drives on received departureDate
    // await this.checkTimeValidity(train.departure_time); // Second validation. It checks the time of departure train and time of purchase the ticket to the train
    await this.checkCarriageValidity(train.id, body.carriage_id); // Third validation. It checks if received train includes the received carriage.
    await this.checkRouteValidity(
      train.route_id,
      body.departure_station,
      body.arrival_station,
    ); // Fourth validation. It checks if departure and arrival stations are in train's route
    await this.checkTicketsSeatsValidity(
      body.departure_station,
      body.arrival_station,
      body.departure_date,
      train.id,
      body.seat_id,
      body.carriage_id,
    ); // Fifth validation. It checks if received seat is available for departure and arrival
  }

  async checkCarriageValidity(trainUUID: string, carriageUUID: string) {
    const carriages = await dbConf('carriages')
      .where('train_id', trainUUID)
      .andWhere('id', carriageUUID);
    if (carriages.length < 1) {
      throw new BadRequestException();
    }
  }

  async checkTrainsFrequency(departureDate: string, trainUUID: string) {
    const trains = await this.trainsService.filterTrainsByFrequencies(
      departureDate,
    );
    const train = trains
      .map((train) => train.id)
      .filter((id) => id === trainUUID);
    if (train.length < 1) {
      throw new BadRequestException();
    }
  }

  async checkRouteValidity(
    routeUUID: string,
    departureStation: string,
    arrivalStation: string,
  ) {
    const arrivals = await this.arrivalsService.getPassingStationsRoutes(
      departureStation,
      arrivalStation,
    );
    if (!arrivals.includes(routeUUID)) {
      throw new BadRequestException();
    }
  }

  async checkTimeValidity(trainDepartureDate: string) {
    const currentTime = new Date();
    const trainTime = new Date();
    const trainTimeInfo = trainDepartureDate.split(':').map(Number);
    trainTime.setHours(trainTimeInfo[0], trainTimeInfo[1]);
    if (trainTime < currentTime)
      throw new BadRequestException(
        `The train is gone at ${trainDepartureDate}`,
      );
  }

  async checkTicketsSeatsValidity(
    departureStation: string,
    arrivalStation: string,
    departureDate: string,
    trainUUID: string,
    seatUUID: string,
    carriageUUID: string,
  ) {
    const availableSeats = await this.seatsService.findAvailableSeats(
      departureStation,
      arrivalStation,
      departureDate,
      trainUUID,
    );

    const seat = availableSeats.filter(
      (seat) => seat.carriage_id === carriageUUID && seat.id === seatUUID,
    );

    if (seat.length < 1)
      throw new BadRequestException(`Seat id: '${seatUUID}' is unavailable`);
  }
}
