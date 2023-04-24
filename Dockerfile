FROM node:16.14.2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

CMD ['npm', 'run', 'start:dev']
