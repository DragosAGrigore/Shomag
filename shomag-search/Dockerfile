FROM node:latest

RUN mkdir -p /usr/src/shomag-search

WORKDIR /usr/src/shomag-search

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4101

CMD ["npm", "start"]