/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpackDevMiddleware: config => {
    config.watchOptions = {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: 500
    }
    return config
  }
}
