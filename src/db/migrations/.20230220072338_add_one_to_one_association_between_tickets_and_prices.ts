// import { Knex } from 'knex';

// export async function up(knex: Knex): Promise<void> {
//   await knex.schema.alterTable('prices', (table) => {
//     table.uuid('ticket_id').references('id').inTable('tickets');
//   });
//   await knex.schema.alterTable('tickets', (table) => {
//     table.uuid('price_id').references('id').inTable('prices');
//   });
// }

// export async function down(knex: Knex): Promise<void> {
//   await knex.schema.alterTable('prices', (table) => {
//     table.dropForeign('ticket_id');
//   });

//   await knex.schema.alterTable('tickets', (table) => {
//     table.dropForeign('price_id');
//   });
// }
