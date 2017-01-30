'use strict'

const app = require('express')()
const env = process.env
const ParseServer = require('parse-server').ParseServer
const url = require('url')

const config = {
  appId: env.APP_ID || 'myAppId',
  appName: env.APP_NAME || 'myAppName',
  clientKey: env.CLIENT_KEY || '',
  cloud: env.CLOUD || __dirname + '/cloud/main.js',
  databaseURI: env.DATABASE_URI || 'mongodb://localhost:27017/dev',
  masterKey: env.MASTER_KEY || '',
  port: env.PORT || 1337,
  publicServerURL: env.PUBLIC_SERVER_URL || env.SERVER_URL,
  serverURL: env.SERVER_URL || 'http://localhost:1337/parse',
  liveQuery: {
    classNames: [] // List of classes to support for query subscriptions
  }
}

let mailer = '(none)'
if (env.MAILGUN_KEY && env.MAILGUN_DOMAIN && env.MAILGUN_FROM) {
  mailer = `Mailgun (${env.MAILGUN_FROM})`
  config.emailAdapter = {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      apiKey: env.MAILGUN_KEY,
      domain: env.MAILGUN_DOMAIN,
      fromAddress: env.MAILGUN_FROM
    }
  }
}

let storage = '(none)'

const server = new ParseServer(config)
app.use(url.parse(config.serverURL).pathname || '/', server)
if (env.ALT_SERVER_URL) {
  app.use(url.parse(env.ALT_SERVER_URL).pathname || '/', server)
}

app.listen(config.port, () => {
  console.log(`Parse Server UP and running on port ${config.port} Accessible at: ${config.serverURL} App ID: ${config.appId} Client Key: ${config.clientKey} Mailer: ${mailer} Storage: ${storage}`)
})