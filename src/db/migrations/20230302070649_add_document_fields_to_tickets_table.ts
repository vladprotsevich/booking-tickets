import { Knex } from 'knex';
import { DocumentType } from 'src/common/enums/document.types.enum';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('tickets', (table) => {
    table.string('name', 50);
    table.string('surname', 50);
    table
      .enum('document_type', Object.values(DocumentType))
      .defaultTo(DocumentType.default);
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
