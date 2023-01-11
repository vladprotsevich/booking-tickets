import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', function (table: Knex.TableBuilder) {
    table.uuid('id');
    table.string('name', 255);
    table.string('surname', 255);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
