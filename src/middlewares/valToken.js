const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token) return res.status(401).json({
    msg: 'Invalid token'
  });
  const [token_name, token_value] = token.split(' ');
  if(token_name !== 'Bearer') return res.status(401).json({
    msg: 'Invalid token type'
  });
  let decode = {};
  try{
    decode = jwt.verify(token_value, process.env.JWT_SECRET)
  }catch(err){
    return res.status(401).json({
      msg: 'Invalid token value'
    })
  }
  req.user = {
    _id: decode._id,
    email: decode.email
  }
  next();
};