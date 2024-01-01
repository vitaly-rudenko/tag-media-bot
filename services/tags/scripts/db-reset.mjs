import { connect } from 'mongoose'

const { connection } = await connect(process.env.MONGODB_URI || '', {
  user: process.env.MONGODB_USER,
  pass: process.env.MONGODB_PASSWORD,
  dbName: process.env.MONGODB_DATABASE,
})

await connection.dropCollection('tags')

process.exit(0)
