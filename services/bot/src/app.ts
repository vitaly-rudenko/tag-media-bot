import { Telegraf } from 'telegraf'
import { tagsService } from './tags-service'
import { UserSession, UserSessions } from './user-sessions'
import { parseTagValues } from './parse-tag-values'
import { MediaType } from '@tag-media-bot/grpc'

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!)

bot.command('start', async (context) => {
  await context.reply('Send a photo, a GIF or a video to tag.')
})

const userSessions = new UserSessions()

bot.on('message', async (context, next) => {
  let userSession: UserSession

  if ('photo' in context.message) {
    userSession = {
      type: MediaType.PHOTO,
      fileId: context.message.photo[0].file_id,
      fileUniqueId: context.message.photo[0].file_unique_id,
    }
  } else if ('video' in context.message) {
    userSession = {
      type: MediaType.VIDEO,
      fileId: context.message.video.file_id,
      fileUniqueId: context.message.video.file_unique_id,
      fileName: context.message.video.file_name,
    }
  } else if ('audio' in context.message) {
    userSession = {
      type: MediaType.AUDIO,
      fileId: context.message.audio.file_id,
      fileUniqueId: context.message.audio.file_unique_id,
      fileName: context.message.audio.file_name,
    }
  } else if ('animation' in context.message) {
    userSession = {
      type:
        context.message.animation.mime_type === 'video/mp4' ? MediaType.MPEG4_GIF : MediaType.GIF,
      fileId: context.message.animation.file_id,
      fileUniqueId: context.message.animation.file_unique_id,
    }
  } else if ('document' in context.message) {
    userSession = {
      type: MediaType.DOCUMENT,
      fileId: context.message.document.file_id,
      fileUniqueId: context.message.document.file_unique_id,
      fileName: context.message.document.file_name,
    }
  } else return next()

  await userSessions.set(context.from.id, userSession)

  await context.reply(`Send tags for this media separated by comma:`)
})

bot.on('message', async (context, next) => {
  if (!('text' in context.message)) return next()

  const userSession = await userSessions.get(context.from.id)
  if (!userSession) return

  await tagsService.create({
    authorUserId: context.from.id,
    values: parseTagValues(context.message.text),
    ...userSession,
  })

  await userSessions.clear(context.from.id)

  await context.reply('Done!')
})

bot.on('inline_query', async (context, next) => {
  if (context.inlineQuery.query.trim().length < 3) return

  const { items: searchResults } = await tagsService.search({
    query: context.inlineQuery.query.trim(),
    limit: 50,
  })

  if (searchResults.length === 0) return next()

  // TODO: fix non-homogeneous results

  const queryResults: ({ id: string } & (
    | { type: 'photo'; photo_file_id: string }
    | { type: 'gif'; gif_file_id: string }
    | { type: 'mpeg4_gif'; mpeg4_file_id: string }
    | { type: 'video'; video_file_id: string; title: string }
    | { type: 'document'; document_file_id: string; title: string }
  ))[] = searchResults.map((tag, index) => {
    if (tag.type === MediaType.PHOTO) {
      return {
        id: String(index),
        type: 'photo',
        photo_file_id: tag.fileId,
      }
    } else if (tag.type === MediaType.GIF) {
      return {
        id: String(index),
        type: 'gif',
        gif_file_id: tag.fileId,
      }
    } else if (tag.type === MediaType.MPEG4_GIF) {
      return {
        id: String(index),
        type: 'mpeg4_gif',
        mpeg4_file_id: tag.fileId,
      }
    } else if (tag.type === MediaType.VIDEO) {
      return {
        id: String(index),
        type: 'video',
        video_file_id: tag.fileId,
        title: tag.fileName ? `Video: ${tag.fileName}` : 'A video file',
      }
    } else if (tag.type === MediaType.AUDIO) {
      return {
        id: String(index),
        type: 'document',
        document_file_id: tag.fileId,
        title: tag.fileName ? `Audio: ${tag.fileName}` : 'An audio file',
      }
    } else if (tag.type === MediaType.DOCUMENT) {
      return {
        id: String(index),
        type: 'document',
        document_file_id: tag.fileId,
        title: tag.fileName ? `Document: ${tag.fileName}` : 'A document',
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
  process.exit(1)
})

console.log('Running')
