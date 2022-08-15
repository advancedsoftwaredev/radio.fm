FROM node:16

COPY . .

RUN yarn install

RUN yarn web build && yarn web export

CMD yarn server start
