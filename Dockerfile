FROM node:16.17.0-alpine

WORKDIR /app

COPY ./package.json .

EXPOSE 3000

RUN npm i

RUN apk add --no-cache curl 

COPY . .

CMD [ "node","app.js" ]