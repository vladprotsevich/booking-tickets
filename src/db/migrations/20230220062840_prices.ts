import { Knex } from 'knex';
import { Carriages } from 'src/common/enums/carriages.enum';
import { Trains } from 'src/common/enums/trains.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('prices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('ticket_id').unique().references('id').inTable('tickets');
    table.uuid('departure_station').index();
    table.uuid('arrival_station').index();
    table.enum('train_type', Object.values(Trains)).notNullable();
    table.enum('carriage_type', Object.values(Carriages)).notNullable();
    table.integer('price');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('prices');
}
