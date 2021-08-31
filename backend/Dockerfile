FROM ruby:3.0.2

ENV LANG C.UTF-8
ENV TZ Asia/Tokyo

RUN mkdir /app
WORKDIR /app

ADD Gemfile /app/Gemfile

RUN apt update -qq && \
  apt install -y build-essential 
RUN apt install libpq-dev 
RUN gem install bundler:2.2.26

RUN bundle install

ADD . /app