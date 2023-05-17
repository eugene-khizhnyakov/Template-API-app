FROM node:16-alpine AS BUILD_IMAGE

RUN apk update && apk add yarn curl bash make && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

COPY package*.json ./

# install dependencies
RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

FROM node:16-alpine

WORKDIR /home/node/app

COPY --from=BUILD_IMAGE /usr/src/app/*.json /home/node/app/
COPY --from=BUILD_IMAGE /usr/src/app/dist /home/node/app/dist
COPY --from=BUILD_IMAGE /usr/src/app/node_modules /home/node/app/node_modules

CMD ["yarn", "start"]
