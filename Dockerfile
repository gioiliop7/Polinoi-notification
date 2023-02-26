FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./db/subscribers.db /app/db/subscribers.db

CMD [ "npm", "start" ]