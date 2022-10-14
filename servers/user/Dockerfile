FROM node:18.10.0-alpine

WORKDIR /usr/src/user

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

EXPOSE 3002

CMD [ "npm", "run", "start:prod" ]