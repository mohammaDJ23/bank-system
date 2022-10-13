FROM node:18.10.0-alpine

WORKDIR /usr/src/bank

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

EXPOSE 3003

CMD [ "npm", "run", "start:dev" ]