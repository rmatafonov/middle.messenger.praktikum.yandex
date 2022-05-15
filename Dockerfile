FROM ubuntu:18.04
RUN apt update && apt install -y nodejs && apt install -y npm
RUN npm install express@4.17.3

WORKDIR /var/www
COPY ./server.js server.js
COPY ./dist dist

EXPOSE 3000
CMD node server.js
