import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('arrivals', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('route_id').references('id').inTable('routes');
    table.uuid('station_id').references('id').inTable('stations');
    table.integer('consistency_number').notNullable().index();
    table.time('travel_time').notNullable();
    table.time('stop_time').notNullable();
    table.unique(['route_id', 'station_id']);
    table.unique(['route_id', 'consistency_number']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('arrivals');
}
