FROM node:18.10.0-alpine

WORKDIR /usr/src/auth

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json

RUN npm install 

COPY . .

RUN npm run build

EXPOSE 3001

CMD [ "npm", "run", "start:prod" ]