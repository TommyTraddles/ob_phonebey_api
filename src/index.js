console.clear()
require('dotenv').config()

const express = require('express')
const db = require('./config/database')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/', (req, res, next) => {
  return res.json({
    success: true, 
    data: 'Hello world'
  })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('✅ Server up')
})
