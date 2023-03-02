import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('seats', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('carriage_id').references('id').inTable('carriages');
    table.string('number', 5).index();
  });
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable('seats');
}
