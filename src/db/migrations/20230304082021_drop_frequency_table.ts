import { Knex } from 'knex';
import { FrequencyEnum } from 'src/common/enums/frequency.enum';

export async function up(knex: Knex): Promise<void> {
  const trainsFrequencies = await knex.table('trains_frequencies').select('*');
  if (trainsFrequencies.length) {
    await knex
      .table('trains_frequencies')
      .del()
      .where('frequency', '!=', 'null');
  }

  const frequencies = await knex.table('frequencies').select('*');
  if (frequencies.length) {
    await knex.table('frequencies').del().where('frequency', '!=', 'null');
  }

  await knex.schema.alterTable('trains_frequencies', (table) => {
    table.dropForeign('train_id');
    table.dropForeign('frequency');
  });

  await knex.schema.dropTable('trains_frequencies');

  await knex.schema.alterTable('frequencies', (table) => {
    table.dropColumn('frequency');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('trains_frequencies', (table) => {
    table.uuid('train_id').references('id').inTable('trains');
    table
      .string('frequency', 25)
      .references('frequency')
      .inTable('frequencies');
  });

  await knex.schema.alterTable('frequencies', (table) => {
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
