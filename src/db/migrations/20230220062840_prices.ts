import { Knex } from 'knex';
import { CarriageType } from 'src/common/enums/carriage.type.enum';
import { TrainType } from 'src/common/enums/train.type.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('prices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('ticket_id').unique().references('id').inTable('tickets');
    table.uuid('departure_station').index();
    table.uuid('arrival_station').index();
    table.enum('train_type', Object.values(TrainType)).notNullable();
    table.enum('carriage_type', Object.values(CarriageType)).notNullable();
    table.integer('price');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('prices');
}
