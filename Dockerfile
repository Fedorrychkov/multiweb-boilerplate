# Dockerfile
FROM node:20.16.0

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

CMD ["npm", "run", "build"]
