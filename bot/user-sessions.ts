import { MediaType } from './tags.ts';

export type UserSession = {
  type: MediaType
  fileName?: string
  fileId: string
  fileUniqueId: string
}

export class UserSessions {
  sessions = new Map<number, UserSession>()

  async set(userId: number, session: UserSession): Promise<void> {
    this.sessions.set(userId, session)
  }

  async get(userId: number): Promise<UserSession | undefined> {
    return this.sessions.get(userId)
  }

  async clear(userId: number): Promise<void> {
    this.sessions.delete(userId)
  }
}
