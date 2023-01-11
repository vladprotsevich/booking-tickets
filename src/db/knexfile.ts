import knex from 'knex';
import * as dotenv from 'dotenv';

dotenv.config();

export const dbConf = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  },
  useNullAsDefault: true,
});

export async function migrate(): Promise<void> {
  await dbConf.migrate.latest({
    directory: __dirname + '/migrations',
    loadExtensions: ['.js'],
  });
}
