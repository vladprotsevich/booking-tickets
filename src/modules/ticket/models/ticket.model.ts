import { DocumentEnum } from 'src/common/enums/document.enum';
import { TicketStatusEnum } from 'src/common/enums/ticket-status.enum';
import { Price } from './price.model';

export class Ticket {
  id: string;

  name: string;

  surname: string;

  user_id: string;

  document_type: DocumentEnum;

  document_number: number;

  train_id: string;

  carriage_id: string;

  seat_id: string;

  departure_date: string;

  departure_station: string;

  arrival_station: string;

  departure_time: Date;

  arrival_time: Date;

  status: TicketStatusEnum;

  purchased_at: string;

  price?: number;
}
