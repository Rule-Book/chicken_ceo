FROM node:alpine3.23 AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

copy . ./

EXPOSE 3000

CMD ["node", "server.js"]
