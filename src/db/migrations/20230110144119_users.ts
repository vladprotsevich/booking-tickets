import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', function (table: Knex.TableBuilder) {
    table.increments('id').primary();
    table.string('name', 255);
    table.string('email', 255);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
