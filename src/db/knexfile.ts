import knex from 'knex';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.development.env' });

export const dbConf = knex({
  client: 'pg',
  connection: {
    host: process.env['POSTGRES_HOST'],
    database: process.env['POSTGRES_DB'],
    user: process.env['POSTGRES_USER'],
    password: process.env['POSTGRES_PASSWORD'],
    port: Number(process.env['POSTGRES_PORT']),
  },
  useNullAsDefault: true,
});

export async function migrate(): Promise<void> {
  await dbConf.migrate.latest({
    directory: __dirname + '/migrations',
    loadExtensions: ['.js'],
  });
}
