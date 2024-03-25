FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production && npm cache clean --force && npm install -g typescript

COPY . .

RUN npm run build

EXPOSE 7970
CMD [ "npm", "start"]
