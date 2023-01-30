import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('arrivals', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('route_id').references('id').inTable('routes');
    table.uuid('station_id').references('id').inTable('stations');
    table.dateTime('departure_time').notNullable();
    table.dateTime('arrival_time').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('arrivals');
}
