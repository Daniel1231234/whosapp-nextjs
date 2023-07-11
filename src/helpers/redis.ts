import * as config from "../config/configuration"

type Command = 'zrange' | 'sismember' | 'get' | 'smembers' | 'zrem' | 'set' | 'hset' | "srem"

export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandUrl = `${config.default().upstashRestUrl}/${command}/${args.join('/')}`

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${config.default().upstashRestToken}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`)
  }

  const data = await response.json()
  return data.result
}




