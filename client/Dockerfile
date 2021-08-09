FROM node:10.18.0-alpine3.10

RUN mkdir /usr/src/client -p

WORKDIR /usr/src/client

RUN apk add --update python && \ 
	apk add --update make && \
	apk add --update g++ && \ 
	apk add --update openjdk11-jre

# Have to copy everything because the build statement in uml-theia-integration starts linting, which requires all files.
# "build": "tsc && yarn run lint"
COPY . .

RUN yarn install

RUN yarn rebuild:browser

WORKDIR ./browser-app

EXPOSE 3000

CMD yarn start --hostname 0.0.0.0
