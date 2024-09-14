import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import databaseService from './services/database.services'
import { loginController } from './controllers/users.controllers'
import rateLimit from 'express-rate-limit'

// import '~/utils/faker'
// import '~/utils/init'

config()
databaseService.connect()

const app = express()

const port = process.env.PORT || 4000

app.use(cors())

const limiter = rateLimit({
  windowMs: 1000,
  limit: 5
})

app.use(limiter)

app.use(express.json())
app.post('/login', loginController)

app.listen(port)
