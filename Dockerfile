FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src

RUN npm install

EXPOSE 3000
