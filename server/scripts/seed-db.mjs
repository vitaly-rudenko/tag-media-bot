import { faker } from '@faker-js/faker'
import { connect, Schema, model } from 'mongoose'

await connect(process.env.MONGODB_URI || '', {
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
  dbName: process.env.MONGODB_DATABASE,
})

const tagSchema = new Schema({
  authorUserId: String,
  tags: [String],
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
    Array.from(new Array(10_000), () => ({
      authorUserId: `user-${faker.number.int({ min: 1, max: 100 })}`,
      createdAt: faker.date.recent(),
      fileId: faker.string.uuid(),
      fileUniqueId: faker.string.uuid(),
      tags: Array.from(new Array(faker.number.int({ min: 5, max: 10 })), () =>
        faker.word.words({ count: { min: 1, max: 10 } }),
      ),
    })),
  )
}

process.exit(0)
