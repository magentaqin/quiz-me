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

export const getUserIdFromToken = async (token: string) => {
  const isVerified = await jwtCheck(token).catch(() => {
    return ''
  })
  if (!isVerified) return ''
  const decodedData = await jwt.decode(token)
  if (!decodedData) return ''
  return decodedData.userId
}
