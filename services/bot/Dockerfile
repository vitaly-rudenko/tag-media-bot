FROM node:20-alpine3.19 as base

# ---------------------- PRUNE
FROM base as prune

WORKDIR /app

RUN npm i -g turbo

COPY turbo.json .
COPY package*.json .
COPY packages packages
COPY services services

RUN turbo prune @tag-media-bot/bot --docker

# ---------------------- PRODUCTION
FROM base as production

WORKDIR /app

COPY --from=prune /app/out/json .
RUN npm ci

COPY --from=prune /app/out/full .
RUN npm run build -- --filter=@tag-media-bot/bot

WORKDIR /app/services/bot

ENV NODE_ENV production

USER node

CMD ["node", "dist/app.js"]
