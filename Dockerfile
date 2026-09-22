FROM node:alpine3.23 AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN apk add --no-cache python3 make
RUN apk add --no-cache sqlite
RUN npm ci --omit=dev

copy . ./

EXPOSE 3000

CMD ["node", "server.js"]
