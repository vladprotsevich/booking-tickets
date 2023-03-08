import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { TicketValidationPipe } from 'src/pipes/ticket-validation.pipe';
import { BookTicketDTO } from './dto/book-ticket.dto';
import { BuyTicketDTO } from './dto/buy-ticket.dto';
import { TicketService } from './ticket.service';

@ApiTags('Ticket')
@ApiBearerAuth()
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
  @UseGuards(JwtAuthGuard)
  @Post('buying')
  async buyingTicket(
    @Body(TicketValidationPipe) body: BuyTicketDTO,
    @Req() req: Request,
  ) {
    return this.ticketService.buyTicket(body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('booking')
  async bookingTicket(
    @Body(TicketValidationPipe) body: BookTicketDTO,
    @Req() req: Request,
  ) {
    return this.ticketService.bookTicket(body, req.user);
  }
}
