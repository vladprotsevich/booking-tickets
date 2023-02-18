import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('routes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name', 255).unique().notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('routes');
}
