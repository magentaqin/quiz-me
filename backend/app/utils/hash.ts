
import bcrypt from 'bcrypt'
import { v5 as uuidv5 } from 'uuid'

// hash password with salt
export const hashPassword: (password: string) => Promise<string> = (password: string) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash([password], saltRounds, function(err: Error, hash: string) {
        if (err) {
          return reject(err)
        }
        if (hash) {
          resolve(hash)
        }
    });
  })
}

// Check password
export const checkPassword = (password: string, hash: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function(err, result) {
        if (err) {
          return reject(err)
        }
        if (result) resolve(result)
    });
  })
}

// generate user id hash value
export const generateUserId= (userName: string) => {
  return uuidv5(userName, 'QUIZ_ME_USER_ID')
}