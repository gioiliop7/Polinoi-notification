FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Copy the database file to the Docker image
COPY db/subscribers.db .

CMD [ "npm", "start" ]