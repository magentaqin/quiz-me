const jwt = require('jsonwebtoken')

const jwtKey = 'cool!!!quizme$$$' 

export const jwtSign = (data) => { 
  // jwt token will be expired in 7 days
  const token = jwt.sign(data, jwtKey, { expiresIn: 60 * 60 * 24 * 7})
  return token
}

export const jwtCheck = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtKey, (err, data) => {
        if (err) {
          return reject(err)
        }
        if (data) {
          resolve(data)
        }
    })
  })
}
