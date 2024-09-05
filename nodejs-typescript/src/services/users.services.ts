import { config } from 'dotenv'
import databaseService from './database.services'
import { hashPassword } from '~/utils/crypto'

config()
class UsersService {
  async login({ username, password }: { username: string; password: string }) {
    const result = await databaseService.users.findOneAndUpdate(
      { username, password: hashPassword(password) },
      {
        $set: {
          loggedIn: 1,
          loggedAt: new Date()
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return result
  }
}

const usersService = new UsersService()
export default usersService
