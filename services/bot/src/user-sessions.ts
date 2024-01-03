import { MediaType } from '@tag-media-bot/grpc'
import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL!)

export type UserSession = {
  type: MediaType
  fileName?: string
  fileId: string
  fileUniqueId: string
}

export class UserSessions {
  sessions = new Map<number, UserSession>()

  async set(userId: number, session: UserSession): Promise<void> {
    await redis.set(`session:${userId}`, JSON.stringify(session), 'EX', 300)
  }

  async get(userId: number): Promise<UserSession | undefined> {
    const rawSession = await redis.get(`session:${userId}`)
    return rawSession ? JSON.parse(rawSession) : undefined
  }

  async clear(userId: number): Promise<void> {
    await redis.del(`session:${userId}`)
  }
}
