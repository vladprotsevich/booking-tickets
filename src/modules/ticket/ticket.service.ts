import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TicketStatusEnum } from 'src/common/enums/ticket-status.enum';
import { dbConf } from 'src/db/knexfile';
import { BookTicketDTO } from './dto/book-ticket.dto';
import { BuyTicketDTO } from './dto/buy-ticket.dto';
import { Ticket } from './models/ticket.model';
import { PriceService } from './price.service';

@Injectable()
export class TicketService {
  constructor(private readonly priceService: PriceService) {}

  private qb() {
    return dbConf<Ticket>('tickets');
  }

  async buyTicket(body: BuyTicketDTO, user: any) {
    return this.createTicket(body, user.id, TicketStatusEnum.unavailable);
  }

  async bookTicket(body: BookTicketDTO, user: any) {
    return this.createTicket(body, user.id, TicketStatusEnum.booked);
  }

  async createTicket(
    body: BuyTicketDTO,
    user_id: string,
    status: TicketStatusEnum,
  ) {
    const ticket = new Ticket();
    ticket.user_id = user_id; // COMMENTS: why do we patch user input data
    ticket.status = status;
    // ...
    const trx = await dbConf.transaction();
    try {
      const [result] = await this.qb()
        .insert(ticket)
        .transacting(trx);
      if (!result) throw new Error('Error inserting ticket');
      const ticketPrice = await this.priceService.createTicketPrice(
        ticket,
        trx,
      );
      ticket.price = ticketPrice.price;
      await trx.commit();
      return result;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot create a ticket with invalid data',
      });
    }
  }
}
