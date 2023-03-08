import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ArrivalService } from 'src/modules/arrival/arrivals.service';
import { CarriageService } from 'src/modules/carriage/carriage.service';
import { SeatService } from 'src/modules/seat/seat.service';
import { Ticket } from 'src/modules/ticket/models/ticket.model';
import { SearchTrainSeatsQueryDTO } from 'src/modules/train/dto/search-available-seats.dto';
import { TrainService } from 'src/modules/train/train.service';

export class TicketValidationPipe implements PipeTransform {
  constructor(
    @Inject(TrainService) private readonly trainService: TrainService,
    @Inject(CarriageService) private readonly carriageService: CarriageService,
    @Inject(ArrivalService) private readonly arrivalService: ArrivalService,
    @Inject(SeatService) private readonly seatService: SeatService,
  ) {}
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const ticketObject = plainToInstance(metatype, value);
    const errors = await validate(ticketObject);

    if (errors.length > 0) throw new BadRequestException('Validation failed');

    await this.validatePurchaseDate(
      ticketObject.train_id,
      ticketObject.departure_date,
    );

    await this.validateTrainFrequencies(
      ticketObject.train_id,
      ticketObject.departure_date,
    );

    if (metatype.name === 'BookTicketDTO')
      await this.validateBookingDate(ticketObject.departure_date);

    await this.validateTrainCarriage(
      ticketObject.train_id,
      ticketObject.carriage_id,
    );

    await this.validateRouteStations(
      ticketObject.departure_station,
      ticketObject.arrival_station,
      ticketObject.train_id,
    );

    await this.validateSeatAvailability(ticketObject);

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private async validateBookingDate(departureDate: string) {
    const departureTime = new Date(departureDate);
    const threeDayRange = new Date(
      new Date(new Date()).setDate(new Date().getDate() + 3),
    );

    if (departureTime > threeDayRange)
      throw new BadRequestException('Bad Request', {
        description:
          'You cannot book a ticket later than 3 days from the train departure',
      });
    return true;
  }

  private async validatePurchaseDate(train_id: string, departureDate: string) {
    const train = await this.trainService.findOne(train_id);
    const currentDateTime = new Date();
    const trainTime = new Date(`${departureDate} ${train.departure_time}`);
    if (currentDateTime > trainTime)
      throw new BadRequestException('Bad Request', {
        description: 'Purchase date is invalid',
      });
    return true;
  }

  private async validateTrainFrequencies(
    train_id: string,
    departureDate: string,
  ) {
    const trains = await this.trainService.filterTrainsByFrequencies(
      departureDate,
    );
    const train = trains.map((train) => train.id).includes(train_id);

    if (!train)
      throw new BadRequestException('Bad Request', {
        description: 'The input data for train is not valid',
      });
    return train;
  }

  private async validateTrainCarriage(train_id: string, carriage_id: string) {
    const carriage = await this.carriageService.findCarriageByTrain(
      carriage_id,
      train_id,
    );

    if (!carriage.length)
      throw new BadRequestException('Bad Request', {
        description: 'The train doest not have the carriage',
      });

    return true;
  }

  private async validateRouteStations(
    departure_station: string,
    arrival_station: string,
    train_id: string,
  ) {
    const train = await this.trainService.findOne(train_id);

    const arrivals = await this.arrivalService.getPassingStationsRoutes(
      departure_station,
      arrival_station,
    );

    const routes = arrivals.map((arrival) => arrival.route_id);

    if (!routes.includes(train.route_id))
      throw new BadRequestException('Bad Request', {
        description:
          'The departure or arrival doenst correspond to the train route',
      });

    return true;
  }

  async validateSeatAvailability(ticket: Ticket) {
    const train = await this.trainService.findOne(ticket.train_id);

    const args: SearchTrainSeatsQueryDTO = {
      departureStation: ticket.departure_station,
      arrivalStation: ticket.arrival_station,
      departureDate: ticket.departure_date,
      train_id: ticket.train_id,
    };
    const availableSeats = await this.seatService.findAvailableSeats(
      args,
      train.route_id,
      false,
    );

    const seat = availableSeats.map((seat) => seat.id).includes(ticket.seat_id);

    if (!seat)
      throw new BadRequestException('Bad Request', {
        description: 'The input seat is occupied to this train',
      });

    return true;
  }
}
