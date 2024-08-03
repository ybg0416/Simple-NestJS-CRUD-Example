FROM node:lts-alpine AS require
LABEL authors="YBG"

FROM require AS modules
WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

FROM require AS builder
WORKDIR /usr/src/app

COPY . .
COPY --from=modules /usr/src/app/node_modules ./node_modules

RUN npx prisma generate
RUN yarn build

FROM require AS runner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env .

#CMD ["tail", "-f"]
CMD [ "node", "dist/main.js" ]