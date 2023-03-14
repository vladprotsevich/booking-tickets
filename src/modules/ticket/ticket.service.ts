import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TicketStatusEnum } from 'src/common/enums/ticket-status.enum';
import { dbConf } from 'src/db/knexfile';
import { ArrivalService } from '../arrival/arrival.service';
import { TrainScheduleService } from '../train/train-schedule.service';
import { TrainService } from '../train/train.service';
import { SanitizedUser } from '../user/models/sanitized-user.';
import { BookTicketDTO } from './dto/book-ticket.dto';
import { BuyTicketDTO } from './dto/buy-ticket.dto';
import { SearchTicketsQueryDTO } from './dto/search-tickets-query.dto';
import { CreateTicketResult, Ticket } from './models/ticket.model';
import { PriceService } from './price.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly priceService: PriceService,
    private readonly arrivalService: ArrivalService,
    private readonly trainService: TrainService,
    private readonly trainScheduleService: TrainScheduleService,
  ) {}

  private qb() {
    return dbConf<Ticket>('tickets');
  }

  async findTickets(query: SearchTicketsQueryDTO) {
    const tickets = this.qb();
    return query ? tickets.where({ status: query.type }) : tickets;
  }

  async findOne(id: string) {
    return this.qb().where({ id }).first();
  }

  async buyTicket(body: BuyTicketDTO, user: SanitizedUser) {
    return this.createTicket(body, user.id, TicketStatusEnum.unavailable);
  }

  async bookTicket(body: BookTicketDTO, user: SanitizedUser) {
    return this.createTicket(body, user.id, TicketStatusEnum.booked);
  }

  async cancelBooking(ticket_id: string) {
    const trx = await dbConf.transaction();
    try {
      const ticket = await this.findOne(ticket_id);
      if (ticket.status === TicketStatusEnum.unavailable)
        throw new Error('You cannot cancel booking from sold ticket');
      await this.priceService.removePriceByTicket(ticket.id, trx);
      const affected = await this.qb()
        .transacting(trx)
        .where({ id: ticket_id })
        .del();
      await trx.commit();
      return Boolean(affected);
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description:
          'Something went wrong. Check if the ticket is valid or booked',
      });
    }
  }

  async createTicket(
    body: BuyTicketDTO,
    user_id: string,
    status: TicketStatusEnum,
  ): Promise<CreateTicketResult> {
    const ticket = this.initializeTicket(body, user_id, status);
    const trx = await dbConf.transaction();
    try {
      await this.qb().insert(ticket).transacting(trx);
      const ticketPrice = await this.priceService.createTicketPrice(
        ticket,
        trx,
      );
      const { departureDateTime, arrivalDateTime } = await this.getTicketTime(
        ticket,
      );
      /* if any of await on line 84 fails and we commit transaction before line 84 =>
        trx.rollback in catch will be called anyway
        (it will not actually do a rollback but can be called on a potentially empty object) 
      */
      await trx.commit();
      return {
        ...ticket,
        departure_time: departureDateTime,
        arrival_time: arrivalDateTime,
        price: ticketPrice.price,
      };
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot create a ticket with invalid data',
      });
    }
  }

  async getTicketTime(
    ticket: Pick<
      Ticket,
      'departure_station' | 'arrival_station' | 'train_id' | 'departure_date'
    >,
  ) {
    const { departure_date } = ticket;
    const train = await this.trainService.findOne(ticket.train_id);
    const departure_time = await this.calculateTicketTime( // COMMENTS: Promise.all
      ticket.departure_station,
      train.route_id,
      train.departure_time,
    );
    const arrival_time = await this.calculateTicketTime(
      ticket.arrival_station,
      train.route_id,
      train.departure_time,
    );

    const departureDateTime = new Date(`${departure_date} ${departure_time}`);
    const arrivalDateTime = new Date(`${departure_date} ${arrival_time}`);

    const departureHour = Number(departure_time.split(':')[0]);
    const arrivalHour = Number(arrival_time.split(':')[0]);

    if (departureHour > arrivalHour)
      arrivalDateTime.setDate(arrivalDateTime.getDay() + 1);

    return { departureDateTime, arrivalDateTime };
  }

  async calculateTicketTime(station_id: string, route_id: string, departure_time: string) {
    const station_order = await this.arrivalService.getCurrentStationOrder(
      route_id,
      station_id,
    );
    const journeyCollection =
      await this.arrivalService.getJourneyCollectionByRoute(
        route_id,
        station_order,
      );
    const { firstDepartureTime, timeCollection } =
      await this.trainService.collectTrainArrivalTime(
        departure_time,
        journeyCollection,
      );
    return this.trainScheduleService.getTotalTravelTime([
      firstDepartureTime,
      ...timeCollection,
    ]);
  }

  initializeTicket(
    body: BuyTicketDTO,
    user_id: string,
    status: TicketStatusEnum,
  ) {
    const ticket = new Ticket();
    ticket.user_id = user_id;
    ticket.status = status;
    ticket.name = body.name;
    ticket.surname = body.surname;
    ticket.document_type = body.document_type;
    ticket.document_number = body.document_number;
    ticket.departure_station = body.departure_station;
    ticket.arrival_station = body.arrival_station;
    ticket.departure_date = body.departure_date;
    ticket.train_id = body.train_id;
    ticket.carriage_id = body.carriage_id;
    ticket.seat_id = body.seat_id;

    return ticket;
  }
}
