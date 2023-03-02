// import { Knex } from 'knex';
// import { Frequencies } from 'src/common/enums/frequency.enum';

// export async function up(knex: Knex): Promise<void> {
//   await knex.schema.alterTable('trains_frequencies', (table) => {
//     table.dropForeign('frequency');
//     table.dropColumn('frequency');
//     table
//       .enum('frequency', Object.values(Frequencies))
//       .index()
//       .defaultTo(Frequencies.daily);
//   });
// }

// export async function down(knex: Knex): Promise<void> {
//   knex.schema.alterTable('trains_frequencies', (table) => {
//     table.dropColumn('frequency');
//     table
//       .string('frequency', 25)
//       .references('frequency')
//       .inTable('frequencies');
//   });
// }
