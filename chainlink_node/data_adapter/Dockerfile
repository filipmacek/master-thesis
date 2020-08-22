FROM node:current-alpine

WORKDIR /usr/src/app
RUN apk -U add vim
COPY package*.json ./

RUN npm install

COPY src ./src
EXPOSE 3000
CMD ["node","src/index.js"]
