import { ObjectId } from 'mongodb'

export interface UserType {
  _id?: ObjectId
  username: string
  password: string
  loggedIn: number
  loggedAt: null | Date
}

export default class User {
  _id?: ObjectId
  username: string
  password: string
  loggedIn: number
  loggedAt: null | Date

  constructor(user: UserType) {
    const date = new Date()
    this._id = user._id
    this.username = user.username
    this.password = user.password
    this.loggedIn = user.loggedIn
    this.loggedAt = user.loggedAt
  }
}
