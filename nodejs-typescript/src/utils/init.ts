import { ObjectId } from 'mongodb'
import User, { UserType } from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from './crypto'

const user: UserType = {
  username: 'abcdef',
  password: '999999',
  loggedIn: 0,
  loggedAt: null
}

const init = async (user: UserType) => {
  const user_id = new ObjectId()
  const result = await databaseService.users.insertOne(
    new User({
      ...user,
      _id: user_id,
      password: hashPassword(user.password)
    })
  )
  if (result) console.log(`Created user success`)
  else console.log(`Created user failed`)
}

init(user).catch((err) => {
  console.log(err)
})
