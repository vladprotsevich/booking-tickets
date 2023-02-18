import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('trains_frequencies', (table) => {
    table.uuid('train_id').references('id').inTable('trains');
    table
      .string('frequency', 25)
      .references('frequency')
      .inTable('frequencies');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('trains_frequencies');
}
