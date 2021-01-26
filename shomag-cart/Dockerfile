FROM node:latest

RUN mkdir -p /usr/src/shomag-cart

WORKDIR /usr/src/shomag-cart

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4102

CMD ["npm", "start"]