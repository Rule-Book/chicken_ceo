git init
npm init -y
npm install express
add start script to package.json
npm install better-sqlite3
npm install dotenv?
pacman -S --needed nodejs npm
  for Dockerfile the following is required `RUN apk add python3 make` python3 alone is not sufficient

for Docker
pacman -S docker
docker build -t rulebook/chicken-ceo:latest
docker --rm -it -p 3000:3000 rulebook/chicken-ceo:latest
docker login
docker pull node:alpine3.23
docker push rulebook/chicken-ceo:latest

passing json to and from api calls for performance & legibility
