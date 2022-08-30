###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:16.13.0-alpine As development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

###################
# BUILD FOR PRODUCTION
###################
FROM node:16.13.0-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TZ=Bangkok/Asia

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

# CMD ["node", "dist/main"]
CMD ["node", "npm", "start"]