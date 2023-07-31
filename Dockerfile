FROM node:lts as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm

RUN pnpm i

COPY . .

RUN pnpm run build

FROM nginx:alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]