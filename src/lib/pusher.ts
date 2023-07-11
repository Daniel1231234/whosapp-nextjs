import PusherServer from 'pusher'
import PusherClient from 'pusher-js'
import * as config from "../config/configuration"

export const pusherServer = new PusherServer({
  appId: config.default().pusherAppId,
  key: config.default().pusherAppKey,
  secret: config.default().pusherAppSecret,
  cluster: 'eu',
  useTLS: true,
})

export const pusherClient = new PusherClient(
  config.default().pusherAppKey,
  {
    cluster: 'eu',
  }
)

