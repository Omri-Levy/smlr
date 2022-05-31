FROM node:14-alpine

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./

ENV NODE_ENV=production

RUN pnpm install

COPY ./ ./

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
