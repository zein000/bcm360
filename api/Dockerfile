FROM mcr.microsoft.com/playwright:v1.50.0-noble

RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /usr/src/app

COPY . .

RUN npm install --force --ignore-scripts

RUN npm run build