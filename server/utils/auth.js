const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      // pop() 方法用于删除数组的最后一个元素并返回删除的元素
      token = token.split(' ').pop().trim();
    }

    // if no token, return request object as is
    if (!token) {
      return req;
    }

    try {
      // decode and attach user data to request object

      // This is where the secret becomes important. If the secret on jwt.verify() doesn't match the secret that was used with jwt.sign(), the object won't be decoded. When the JWT verification fails, an error is thrown.
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      // data:
      // {
      //   username: 'neo2',
      //   email: 'neo2@gmail.com',
      //   _id: '62a249cc003a09f12c011ed8'
      // };
      req.user = data;
      console.log(data);
    } catch {
      console.log('Invalid token');
    }

    // return updated request object
    return req;
  },
};
