import * as dotenv from 'dotenv';
dotenv.config();

export const configuration = {
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  },
  migrations: {
    extension: 'ts',
    directory: './migrations',
    tableName: 'knex_migrations',
  },
};
