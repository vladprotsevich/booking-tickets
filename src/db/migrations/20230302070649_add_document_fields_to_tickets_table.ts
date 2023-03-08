import { Knex } from 'knex';
import { DocumentEnum } from 'src/common/enums/document.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tickets', (table) => {
    table.string('name', 50);
    table.string('surname', 50);
    table
      .enum('document_type', Object.values(DocumentEnum))
      .defaultTo(DocumentEnum.default);
    table.string('document_number', 30);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tickets', (table) => {
    table.dropColumn('name');
    table.dropColumn('surname');
    table.dropColumn('document_type');
    table.dropColumn('document_number');
  });
}
