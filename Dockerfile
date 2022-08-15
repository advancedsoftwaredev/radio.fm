FROM node:16.16.0

COPY . .

RUN yarn install

RUN yarn web build && yarn web export

CMD yarn server start