FROM node:16.17.1 as app-builder

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM app-builder AS app-server

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=app-builder ./app/dist ./dist

EXPOSE 8080

CMD ["yarn", "start"]