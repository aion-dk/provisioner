FROM node:16.19-buster-slim

WORKDIR /usr/src/app

COPY . .

RUN yarn install

EXPOSE 3021
CMD "npm run dev"
