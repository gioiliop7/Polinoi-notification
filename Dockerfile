FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN mkdir db && \
    cp subscribers.db db/

CMD [ "npm", "start" ]