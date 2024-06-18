# syntax=docker/dockerfile:1
ARG NODE_VERSION=20

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/
FROM ghcr.io/puppeteer/puppeteer:22.11.1
WORKDIR /usr/src/app
COPY . .
ENV PUPPETEER_SKIP_CHROMINUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/user/bin/google-chrome-stable \
    NODE_ENV=production

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7



FROM node:${NODE_VERSION}-alpine

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,id=s/${RAILWAY_SERVICE_ID}-/root/npm,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER node

WORKDIR /usr/src/app
# Copy the rest of the source files into the image.
COPY . .



# Expose the port that the application listens on.
EXPOSE 8081

# Run the application.
CMD npm start
