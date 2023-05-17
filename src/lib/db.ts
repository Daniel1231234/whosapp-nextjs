import { Redis } from '@upstash/redis'

export const db = Redis.fromEnv()


// Function to delete a value from the hash
export async function deleteValueFromHash(key: string, value: string) {
    // Use the HDEL command to delete the value from the hash
    await db.hdel(key, value)
  }