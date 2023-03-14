import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('arrivals', (table) => {
    table.dropColumn('travel_time');
    table.dropColumn('stop_time');
  });

  await knex.schema.alterTable('arrivals', (table) => {
    table.integer('travel_time');
    table.integer('stop_time');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('arrivals', (table) => {
    table.time('travel_time').alter();
    table.time('stop_time').alter();
  });
}
