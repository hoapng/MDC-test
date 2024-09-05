import { config } from 'dotenv'
import usersService from '~/services/users.services'

config()

export const loginController = async (req: any, res: any) => {
  const { username, password } = req.body
  const result = await usersService.login({ username, password })
  if (result) {
    return res.json({
      result: 'success',
      userId: result._id
    })
  } else {
    return res.json({
      result: 'failed'
    })
  }
}
