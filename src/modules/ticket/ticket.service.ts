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
    const trx = await dbConf.transaction();
    body.user_id = user_id;
    body.status = status;
    try {
      const [ticket] = await this.qb()
        .insert(body)
        .transacting(trx)
        .returning('*');
      const ticketPrice = await this.priceService.createTicketPrice(
        ticket,
        trx,
      );
      ticket.price = ticketPrice.price;
      await trx.commit();
      return ticket;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw new BadRequestException('Bad Request', {
        description: 'Cannot create a ticket with invalid data',
      });
    }
  }
}
