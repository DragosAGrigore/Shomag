FROM node:latest

RUN mkdir -p /usr/src/shomag-client

WORKDIR /usr/src/shomag-client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4200

CMD ["npm", "start"]
