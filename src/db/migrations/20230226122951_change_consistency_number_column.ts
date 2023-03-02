import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('arrivals', (table) => {
    table.renameColumn('consistency_number', 'order');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('arrivals', (table) => {
    table.renameColumn('order', 'consistency_number');
  });
}
