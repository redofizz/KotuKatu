FROM node:14.17.5

WORKDIR /app

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

RUN apt-get update -y && \
  apt-get upgrade -y && \
  npm install npm && \
  npm install ejs &&\ 
  npm install next &&\
  npm install -g create-next-app --typescript &&\
  npm install defu

ADD . /app