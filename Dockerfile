FROM postgres

COPY ./load-extensions.sql /docker-entrypoint-initdb.d/

FROM node:18.13.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "start:dev"]
