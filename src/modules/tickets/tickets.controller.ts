import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { AuthUser } from '../auth/auth.user.provider';
import { SanitizedUser } from '../users/dto/user.sanitized.dto';
import { BuyTicketDTO } from './dto/ticket.buy.dto';
import { TicketsService } from './tickets.service';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('buying')
  async buyingTicket(
    @Body() body: BuyTicketDTO,
    @AuthUser() user: SanitizedUser,
  ) {
    return this.ticketsService.buyTicket(body, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('booking')
  async bookingTicket(
    @Body() body: BuyTicketDTO,
    @AuthUser() user: SanitizedUser,
  ) {
    return this.ticketsService.bookTicket(body, user);
  }
}
