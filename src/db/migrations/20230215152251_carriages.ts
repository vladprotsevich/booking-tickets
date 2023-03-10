import { Knex } from 'knex';
import { CarriageEnum } from 'src/common/enums/carriage.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('carriages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('train_id').references('id').inTable('trains');
    table.integer('carriage_number').index();
    table.uuid('first_conductor_id').index();
    table.uuid('second_conductor_id').index();
    table
      .enum('carriage_type', Object.values(CarriageEnum))
      .defaultTo(CarriageEnum.reserved);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('carriages');
}
