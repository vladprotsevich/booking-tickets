import { Knex } from 'knex';
import { faker } from '@faker-js/faker';

export async function up(knex: Knex): Promise<void> {
  // const stationsCollection = [];
  // const routesCollection = [];
  // const arrivalsCollection = [];
  // for (let i = 0; i < 5; i++) {
  //   stationsCollection.push(`${faker.address.city()} Station`);
  // }
  // for (let i = 0; i < 2; i++) {
  //   routesCollection.push(
  //     `${faker.address.country()}-${faker.address.country()}`,
  //   );
  // }
  // for (let i = 0; i < 5; i++) {
  //   arrivalsCollection.push({});
  // }
  // const stations = await knex
  //   .table('stations')
  //   .insert(stationsCollection)
  //   .returning('*');
  // const routes = await knex
  //   .table('routes')
  //   .insert(routesCollection)
  //   .returning('*');
}

export async function down(knex: Knex): Promise<void> {}
