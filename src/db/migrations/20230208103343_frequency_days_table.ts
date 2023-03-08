import { Knex } from 'knex';
import { FrequencyEnum } from 'src/common/enums/frequency.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('frequencies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .enum('frequency', Object.values(FrequencyEnum))
      .defaultTo(FrequencyEnum.daily)
      .unique();
  });

  const frequencies = Object.values(FrequencyEnum)
    .filter((freq) => isNaN(Number(freq)))
    .map((frequency) => knex.table('frequencies').insert({ frequency }));

  await Promise.all(frequencies);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('frequencies');
}
