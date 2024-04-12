FROM node:18

WORKDIR /usr/src/app

COPY package.json ./

COPY . .

RUN yarn install

RUN yarn build

EXPOSE 7970

CMD ["yarn", "start"]