import { faker } from '@faker-js/faker'
import { connect, Schema, model } from 'mongoose'

await connect(process.env.MONGODB_URI || '', {
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
  dbName: process.env.MONGODB_DATABASE,
})

const tagSchema = new Schema({
  authorUserId: Number,
  values: [String],
  type: String,
  fileName: String,
  fileUniqueId: String,
  fileId: String,
  createdAt: Date,
})

const TagModel = model('Tag', tagSchema, 'tags')

await TagModel.collection.drop()
await TagModel.deleteMany()

await TagModel.collection.createIndex({ tags: 1 })

for (let i = 0; i < 10; i++) {
  console.log('Progress:', i + 1, '/', 10)

  await TagModel.insertMany(
    Array.from(new Array(10_000), (_, i) => ({
      authorUserId: faker.number.int({ min: 1, max: 100 }),
      values: Array.from(new Array(faker.number.int({ min: 5, max: 10 })), () =>
        faker.word.words({ count: { min: 1, max: 10 } }),
      ),
      type: faker.helpers.arrayElement([
        'audio',
        'video',
        'photo',
        'document',
        'gif',
        'mpeg4_gif',
      ]),
      ...(i % 2 === 0 && { fileName: faker.system.fileName() }),
      fileUniqueId: faker.string.uuid(),
      fileId: faker.string.uuid(),
      createdAt: faker.date.recent(),
    })),
  )
}

process.exit(0)
