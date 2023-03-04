import { Knex } from 'knex';
import { dbConf } from '../knexfile';
import * as bcrypt from 'bcrypt';

export async function up(knex: Knex): Promise<void> {
  const admin = {
    name: 'admin',
    surname: 'surname',
    email: 'admin23@example.com',
    password: await bcrypt.hash('adminpassword', 5),
    role: 'Admin',
  };
  await knex.table('users').insert(admin);
}

export async function down(knex: Knex): Promise<void> {
  await dbConf('users').del().where({ email: 'admin@example.com' });
}
