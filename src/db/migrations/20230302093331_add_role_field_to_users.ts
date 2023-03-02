import { Knex } from 'knex';
import { Roles } from 'src/common/enums/roles.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.enum('role', Object.values(Roles)).defaultTo(Roles.passenger);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('role');
  });
}
