const jwt = require('jsonwebtoken');

module.exports = (user_id) => {
  const token = jwt.sign(user_id, process.env.JWT_SECRET, 
    { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)}
  )
  if(!token) console.log('access token error')
  return token
}