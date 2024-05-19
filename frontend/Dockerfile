FROM node:20 AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install --also=dev && npm cache clean --force && npm install -g typescript vite

COPY . .

RUN npm run build

FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
