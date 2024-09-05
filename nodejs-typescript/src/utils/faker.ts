import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'
import User, { UserType } from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from './crypto'

function makeid() {
  let result = ''
  const characters = '0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

function makename() {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  const charactersLength = characters.length
  let counter = 0
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

export function createRandomUser(): UserType {
  return {
    username: makename(),
    password: makeid(),
    loggedIn: 0,
    loggedAt: null
  }
}

const users: UserType[] = faker.helpers.multiple(createRandomUser, {
  count: 1000000
})

// const insertMultipleUsers = async (users: UserType[]) => {
//   console.log('Creating users...')
//   const result = await Promise.all(
//     users.map(async (user) => {
//       const user_id = new ObjectId()
//       await databaseService.users.insertOne(
//         new User({
//           ...user,
//           _id: user_id,
//           password: hashPassword(user.password)
//         })
//       )
//       return user_id
//     })
//   )
//   console.log(`Created ${result.length} users`)
//   return result
// }

const insertMultipleUsers = async (users: UserType[], batchSize: number = 1000) => {
  console.log('Creating users...')

  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize)

    const result = await Promise.all(
      batch.map(async (user) => {
        const user_id = new ObjectId()
        await databaseService.users.insertOne(
          new User({
            ...user,
            _id: user_id,
            password: hashPassword(user.password)
          })
        )
        return user_id
      })
    )

    console.log(`Created ${result.length} users in batch ${Math.floor(i / batchSize) + 1}`)
  }

  console.log(`Created total ${users.length} users`)
}

async function insertBulkUsers(users: UserType[]) {
  {
    const collection = databaseService.users

    const bulkOps = users.map((user) => ({
      insertOne: {
        document: {
          ...user,
          _id: new ObjectId(),
          password: hashPassword(user.password)
        }
      }
    }))
    const result = await collection.bulkWrite(bulkOps)
    console.log(`Inserted ${result.insertedCount} users`)
  }
}

insertBulkUsers(users).catch((err) => {
  console.log(err)
})
