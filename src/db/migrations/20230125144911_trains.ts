import { Knex } from 'knex';
import { TrainEnum } from 'src/common/enums/train.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('TrainEnum', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.increments('number').unique().index();
    table.uuid('machinist_id').references('id').inTable('users');
    table.uuid('driver_assistant_id').references('id').inTable('users');
    table.uuid('head_of_train_id').references('id').inTable('users');
    table.uuid('route_id').references('id').inTable('routes');
    table.time('departure_time').notNullable();
    table
      .enum('train_type', Object.values(TrainEnum))
      .defaultTo(TrainEnum.regional);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('trains');
}
