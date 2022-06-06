FROM node:14-alpine AS development

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY tsconfig.json ./

RUN pnpm i 

COPY . .

RUN pnpm build

FROM node:14-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm i --prod

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
