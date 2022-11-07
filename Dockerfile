FROM node:14.17.6

WORKDIR /usr/src/app
COPY package.json ./
COPY server.js ./
RUN npm config set registry http://registry.npmjs.org/
RUN npm install

EXPOSE 3333
CMD ["npm", "start"]
