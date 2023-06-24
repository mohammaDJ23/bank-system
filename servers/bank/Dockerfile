FROM node:18.10.0-alpine

WORKDIR /usr/src/bank

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3003

CMD [ "npm", "run", "start:prod" ]