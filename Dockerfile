FROM node:16.17.0-alpine

WORKDIR /app

COPY ./package.json .

EXPOSE 3000

RUN npm i

COPY . .

CMD [ "node","app.js" ]