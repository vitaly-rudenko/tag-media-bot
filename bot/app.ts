import { Telegraf } from 'npm:telegraf'
import { load } from 'https://deno.land/std@0.210.0/dotenv/mod.ts'

await load({ export: true })

const bot = new Telegraf(Deno.env.get('TELEGRAM_BOT_TOKEN')!)

bot.command('start', async (context) => {
  await context.reply('Send a photo, a GIF or a video to tag.')
})

type Media = {
  type: 'video' | 'audio' | 'photo' | 'gif' | 'mpeg4_gif'
  fileId: string
  fileUniqueId: string
}

type Tag = {
  media: Media
  tags: string[]
}

const sessions: Record<string, Media> = {}
const tags: Tag[] = []

bot.on('message', async (context, next) => {
  let media: Media

  if ('photo' in context.message) {
    media = {
      type: 'photo',
      fileId: context.message.photo[0].file_id,
      fileUniqueId: context.message.photo[0].file_unique_id,
    }
  } else if ('video' in context.message) {
    media = {
      type: 'video',
      fileId: context.message.video.file_id,
      fileUniqueId: context.message.video.file_unique_id,
    }
  } else if ('audio' in context.message) {
    media = {
      type: 'audio',
      fileId: context.message.audio.file_id,
      fileUniqueId: context.message.audio.file_unique_id,
    }
  } else if ('animation' in context.message) {
    media = {
      type: context.message.animation.mime_type === 'video/mp4' ? 'mpeg4_gif' : 'gif',
      fileId: context.message.animation.file_id,
      fileUniqueId: context.message.animation.file_unique_id,
    }
  } else return next()

  sessions[context.message.from.id] = media

  await context.reply(`Send tags for this ${media.type} separated by comma:`)
})

bot.on('message', async (context, next) => {
  if (!('text' in context.message)) return next()
  if (!sessions[context.from.id]) return

  tags.push({
    media: sessions[context.from.id],
    tags: context.message.text.split(', '),
  })

  delete sessions[context.from.id]

  await context.reply('Done!')
})

bot.on('inline_query', async (context, next) => {
  if (context.inlineQuery.query.trim().length < 3) return

  const searchResults = tags
    .filter((tag) => tag.tags.some((t) => t.startsWith(context.inlineQuery.query)))

  if (searchResults.length === 0) return next()

  const queryResult: ({ id: string } & (
    { type: 'photo'; photo_file_id: string } |
    { type: 'gif'; gif_file_id: string } |
    { type: 'mpeg4_gif'; mpeg4_file_id: string } |
    { type: 'video'; video_file_id: string; title: string } |
    { type: 'document'; document_file_id: string; title: string }
  ))[] = searchResults.map((tag, index) => {
    if (tag.media.type === 'photo') {
      return {
        id: String(index),
        type: 'photo',
        photo_file_id: tag.media.fileId,
      }
    } else if (tag.media.type === 'gif') {
      return {
        id: String(index),
        type: 'gif',
        gif_file_id: tag.media.fileId,
      }
    } else if (tag.media.type === 'mpeg4_gif') {
      return {
        id: String(index),
        type: 'mpeg4_gif',
        mpeg4_file_id: tag.media.fileId,
      }
    } else if (tag.media.type === 'video') {
      return {
        id: String(index),
        type: 'video',
        video_file_id: tag.media.fileId,
        title: `Video: ${tag.tags.join(', ')}`,
      }
    } else if (tag.media.type === 'audio') {
      return {
        id: String(index),
        type: 'document',
        document_file_id: tag.media.fileId,
        title: `Audio: ${tag.tags.join(', ')}`,
      }
    } else {
      throw new Error('Invalid media type')
    }
  })

  await context.answerInlineQuery(queryResult, {
    cache_time: 5, // TODO: change for local testing
  })
})

// TODO: use webhooks
await bot.launch()
