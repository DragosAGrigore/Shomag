FROM node:latest

RUN mkdir -p /usr/src/shomag-app

WORKDIR /usr/src/shomag-app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4100

CMD ["npm", "start"]