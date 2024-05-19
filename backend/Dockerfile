FROM node:20

WORKDIR /usr/src/app

COPY package.json ./

COPY . .

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]