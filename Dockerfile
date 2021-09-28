FROM node:14

WORKDIR /app

COPY ["package.json", "package-lock.json*", "yarn.lock", "./"]

RUN npm i -g npm

RUN npm i -g yarn --force

RUN yarn install

COPY . .

RUN yarn build

ENV HOST 0.0.0.0
ENV NODE_ENV production
EXPOSE 5555

# start command
CMD [ "yarn", "start" ]
