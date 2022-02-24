FROM node:alpine

WORKDIR /usr/src/app
COPY package.json ./
COPY server.js ./

RUN npm install

EXPOSE 3333
CMD ["npm", "start"]
