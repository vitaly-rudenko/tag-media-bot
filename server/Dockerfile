FROM node:20-alpine3.19

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV production

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
