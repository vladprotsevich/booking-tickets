import { Knex } from 'knex';
import { FrequencyType } from 'src/common/enums/frequency.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('frequencies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .enum('frequency', Object.values(FrequencyType))
      .defaultTo(FrequencyType.daily)
      .unique();
  });

  const frequencies = Object.values(FrequencyType)
    .filter((freq) => isNaN(Number(freq)))
    .map((frequency) => knex.table('frequencies').insert({ frequency }));

  await Promise.all(frequencies);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('frequencies');
}
