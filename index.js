require('dotenv').config();
const express = require('express');
const app = express();
const config = require('config')
const port = config.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

if(port !== 3080){
  app.use(require('morgan')('combined'))
}

require('./src/routes/index')(app)
require('./src/routes/UsersRoute')(app)
require('./src/routes/LoginRoute')(app)

app.listen(port, () => {
  console.log("Server started", port)
})
module.exports = app;