FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN corepack enable
RUN yarn

COPY . .

EXPOSE 5173
RUN npm run build
