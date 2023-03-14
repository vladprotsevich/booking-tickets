import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('arrivals', (table) => {
    table.index('route_id');
    table.index('station_id');
  });

  await knex.schema.alterTable('carriages', (table) => {
    table.index('train_id');
  });

  await knex.schema.alterTable('frequencies', (table) => {
    table.index('train_id');
  });

  await knex.schema.alterTable('prices', (table) => {
    table.index('ticket_id');
  });

  await knex.schema.alterTable('tickets', (table) => {
    table.index('seat_id');
  });

  await knex.schema.alterTable('trains', (table) => {
    table.index('route_id');
    table.index('number');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('arrivals', (table) => {
    table.dropIndex('route_id');
    table.dropIndex('station_id');
  });

  await knex.schema.alterTable('carriages', (table) => {
    table.dropIndex('train_id');
  });

  await knex.schema.alterTable('frequencies', (table) => {
    table.dropIndex('train_id');
  });

  await knex.schema.alterTable('prices', (table) => {
    table.dropIndex('ticket_id');
  });

  await knex.schema.alterTable('tickets', (table) => {
    table.dropIndex('seat_id');
  });

  await knex.schema.alterTable('trains', (table) => {
    table.dropIndex('route_id');
    table.dropIndex('number');
  });
}
