FROM node:lts-alpine

ARG NPM_TOKEN

WORKDIR /app

COPY . /app

RUN cat /app/.npmrc >> ~/.npmrc && \
   echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" > ~/.npmrc && \
   npm ci

EXPOSE 3000

CMD ["node", "index.js"]
