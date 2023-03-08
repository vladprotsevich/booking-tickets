import { Knex } from 'knex';
import { CarriageEnum } from 'src/common/enums/carriage.enum';
import { TrainEnum } from 'src/common/enums/train.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('prices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('ticket_id').unique().references('id').inTable('tickets');
    table.uuid('departure_station').index();
    table.uuid('arrival_station').index();
    table.enum('train_type', Object.values(TrainEnum)).notNullable();
    table.enum('carriage_type', Object.values(CarriageEnum)).notNullable();
    table.integer('price');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('prices');
}
