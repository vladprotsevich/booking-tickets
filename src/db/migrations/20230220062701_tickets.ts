import { Knex } from 'knex';
import { TicketStatusEnum } from 'src/common/enums/ticket-status.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tickets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('train_id').index();
    table.uuid('carriage_id').index();
    table.uuid('seat_id').references('id').inTable('seats');
    table.uuid('user_id').index();
    table.string('departure_date', 25).index();
    table.uuid('departure_station').index();
    table.uuid('arrival_station').index();
    table.enum('status', Object.values(TicketStatusEnum));
    table.timestamp('purchased_at').defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table.unique(['seat_id', 'departure_station', 'departure_date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tickets');
}
