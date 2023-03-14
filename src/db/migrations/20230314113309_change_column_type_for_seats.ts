import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('seats', (table) => {
    table.integer('number').alter();
  });

  await knex.schema.alterTable('users', (table) => {
    table.string('token', 255).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('seats', (table) => {
    table.string('number', 5).alter();
  });

  await knex.schema.alterTable('users', (table) => {
    table.text('token').alter();
  });
}
