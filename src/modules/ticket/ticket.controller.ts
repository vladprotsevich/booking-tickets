import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { TicketValidationPipe } from 'src/pipes/ticket-validation.pipe';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../user/decorators/user.decorator';
import { SanitizedUser } from '../user/models/sanitized-user.';
import { BookTicketDTO } from './dto/book-ticket.dto';
import { BuyTicketDTO } from './dto/buy-ticket.dto';
import { SearchTicketsQueryDTO } from './dto/search-tickets-query.dto';
import { TicketService } from './ticket.service';

@ApiTags('Ticket')
@ApiBearerAuth()
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}
  @ApiCreatedResponse({ description: 'Ticket successfully buyed!' })
  @UseGuards(JwtAuthGuard)
  @Post('buying')
  async buyingTicket(
    @Body(TicketValidationPipe) body: BuyTicketDTO,
    @User() user: SanitizedUser,
  ) {
    return this.ticketService.buyTicket(body, user);
  }

  @ApiCreatedResponse({ description: 'Ticket successfully booked!' })
  @UseGuards(JwtAuthGuard)
  @Post('/booking')
  async bookingTicket(
    @Body(TicketValidationPipe) body: BookTicketDTO,
    @User() user: SanitizedUser,
  ) {
    return this.ticketService.bookTicket(body, user);
  }

  @ApiCreatedResponse({ description: 'Tickets list' })
  @Roles('Manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('/')
  async getTickets(@Query() query: SearchTicketsQueryDTO) {
    return this.ticketService.findTickets(query);
  }

  @ApiCreatedResponse({ description: 'Booked ticket is canceled' })
  @Roles('Manager')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete('/:id/cancel-booking')
  async cancelBooking(@Param('id') ticket_id: string) {
    return this.ticketService.cancelBooking(ticket_id);
  }
}
