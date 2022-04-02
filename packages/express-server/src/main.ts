import express from 'express'
import { join } from 'path'

const app = express()
const PORT = process.env.PORT || 3000

const clientPath = join(__dirname, '../../open-rails-docs/build')

app.use(express.static(clientPath))

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))
