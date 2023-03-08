import { Knex } from 'knex';
import { RoleEnum } from 'src/common/enums/role.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.enum('role', Object.values(RoleEnum)).defaultTo(RoleEnum.passenger);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('role');
  });
}
