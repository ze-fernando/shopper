FROM node:18-alpine

WORKDIR /Shopper

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx tsc

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
