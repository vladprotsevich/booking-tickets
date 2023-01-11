import knex from 'knex';
import { configuration } from '../config';

const dbConf = {
  client: 'pg',
  connection: configuration.connection,
  migrations: configuration.migrations,
  useNullAsDefault: true,
};

export const db = knex(dbConf);

export default dbConf;

export async function migrate(): Promise<void> {
  await db.migrate.latest({
    directory: __dirname + '/migrations',
    loadExtensions: ['.js'],
  });
}
