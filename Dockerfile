# syntax=docker/dockerfile:1
FROM ghcr.io/puppeteer/puppeteer:22.11.1 as BUILD
ENV PUPPETEER_SKIP_CHROMINUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/user/bin/google-chrome-stable
COPY .  .


FROM node:20.14.0-alpine
USER node
WORKDIR /src/user/app
COPY  . .

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,id=<cache-id> \
    npm ci --omit=dev


ENV NODE_ENV=production

EXPOSE 8088

CMD npm start
