import { Telegraf } from 'telegraf'
import { Tags } from './tags.ts';
import { UserSession, UserSessions } from './user-sessions.ts';
import { CreateTag, tagsPackage } from '@tag-media-bot/grpc'

const bot = new Telegraf(process.env.get('TELEGRAM_BOT_TOKEN')!)

bot.command('start', async (context) => {
  await context.reply('Send a photo, a GIF or a video to tag.')
})

const tags = new Tags()
const userSessions = new UserSessions()

bot.on('message', async (context, next) => {
  let userSession: UserSession

  if ('photo' in context.message) {
    userSession = {
      type: 'photo',
      fileId: context.message.photo[0].file_id,
      fileUniqueId: context.message.photo[0].file_unique_id,
    }
  } else if ('video' in context.message) {
    userSession = {
      type: 'video',
      fileId: context.message.video.file_id,
      fileUniqueId: context.message.video.file_unique_id,
      fileName: context.message.video.file_name,
    }
  } else if ('audio' in context.message) {
    userSession = {
      type: 'audio',
      fileId: context.message.audio.file_id,
      fileUniqueId: context.message.audio.file_unique_id,
      fileName: context.message.audio.file_name,
    }
  } else if ('animation' in context.message) {
    userSession = {
      type: context.message.animation.mime_type === 'video/mp4' ? 'mpeg4_gif' : 'gif',
      fileId: context.message.animation.file_id,
      fileUniqueId: context.message.animation.file_unique_id,
    }
  } else if ('document' in context.message) {
    userSession = {
      type: 'document',
      fileId: context.message.document.file_id,
      fileUniqueId: context.message.document.file_unique_id,
      fileName: context.message.document.file_name,
    }
  } else return next()

  await userSessions.set(context.from.id, userSession)

  await context.reply(`Send tags for this ${userSession.type} separated by comma:`)
})

bot.on('message', async (context, next) => {
  if (!('text' in context.message)) return next()

  const userSession = await userSessions.get(context.from.id)
  if (!userSession) return

  await tags.create({
    authorUserId: context.from.id,
    tagValue: context.message.text,
    ...userSession,
  })

  await userSessions.clear(context.from.id)

  await context.reply('Done!')
})

bot.on('inline_query', async (context, next) => {
  if (context.inlineQuery.query.trim().length < 3) return

  const searchResults = await tags.search({
    query: context.inlineQuery.query.trim(),
    limit: 50,
  })

  if (searchResults.length === 0) return next()

  // TODO: fix non-homogeneous results

  const queryResults: ({ id: string } & (
    { type: 'photo'; photo_file_id: string } |
    { type: 'gif'; gif_file_id: string } |
    { type: 'mpeg4_gif'; mpeg4_file_id: string } |
    { type: 'video'; video_file_id: string; title: string } |
    { type: 'document'; document_file_id: string; title: string }
  ))[] = searchResults.map((tag, index) => {
    if (tag.type === 'photo') {
      return {
        id: String(index),
        type: 'photo',
        photo_file_id: tag.fileId,
      }
    } else if (tag.type === 'gif') {
      return {
        id: String(index),
        type: 'gif',
        gif_file_id: tag.fileId,
      }
    } else if (tag.type === 'mpeg4_gif') {
      return {
        id: String(index),
        type: 'mpeg4_gif',
        mpeg4_file_id: tag.fileId,
      }
    } else if (tag.type === 'video') {
      return {
        id: String(index),
        type: 'video',
        video_file_id: tag.fileId,
        title: tag.fileName ? `${tag.type}: ${tag.fileName}` : tag.type,
      }
    } else if (tag.type === 'audio') {
      return {
        id: String(index),
        type: 'document',
        document_file_id: tag.fileId,
        title: tag.fileName ? `${tag.type}: ${tag.fileName}` : tag.type,
      }
    } else if (tag.type === 'document') {
      return {
        id: String(index),
        type: 'document',
        document_file_id: tag.fileId,
        title: tag.fileName ? `${tag.type}: ${tag.fileName}` : tag.type,
      }
    } else {
      throw new Error('Invalid media type')
    }
  })

  await context.answerInlineQuery(queryResults, {
    cache_time: 5, // TODO: change for local testing
  })
})

// TODO: use webhooks
bot.launch().catch((error) => {
  console.error(error)
  Deno.exit(1)
})

console.log('Running')
