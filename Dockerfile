FROM node:lts-alpine

WORKDIR /var/app

EXPOSE 3000

ENV NODE_ENV 'production'

COPY . .

RUN yarn install --production --pure-lockfile --no-audit

ENV NODE_ENV production
CMD node index.js