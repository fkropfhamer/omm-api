FROM node:14

WORKDIR /app

COPY ./src /app/src
COPY ./package.json /app
COPY ./yarn.lock /app
COPY ./tsconfig.json /app

RUN mkdir uploads
RUN mkdir uploads/memes
RUN mkdir uploads/templates

RUN yarn
RUN yarn build

CMD [ "node", "build/index.js" ] 
