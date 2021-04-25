const config = require('config');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Mortadela123:Mortadela123@cluster0.u69i7.mongodb.net/' + config.DB_NAME + '?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, (err) => {
  if(err){
    console.log(err)
  }
  console.log('Connected')
});
mongoose.Promise = global.Promise

module.exports = mongoose;