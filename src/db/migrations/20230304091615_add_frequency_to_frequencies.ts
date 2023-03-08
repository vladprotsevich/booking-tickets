import { Knex } from 'knex';
import { FrequencyEnum } from 'src/common/enums/frequency.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('frequencies', (table) => {
    table.uuid('train_id').references('id').inTable('trains');
    table
      .enum('frequency', Object.values(FrequencyEnum))
      .defaultTo(FrequencyEnum.daily);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('frequencies', (table) => {
    table.dropForeign('train_id');
    table.dropColumn('frequency');
    table
      .enum('frequency', Object.values(FrequencyEnum))
      .defaultTo(FrequencyEnum.daily)
      .unique();
  });
}
