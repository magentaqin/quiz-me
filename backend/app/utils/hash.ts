
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

// hash password with salt
export const hashPassword: (password: string) => Promise<string> = (password: string) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function(err: Error, hash: string) {
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
        if (result) return resolve(result)
        return reject(err)
    });
  })
}

// generate uuid hash value
export const generateUuid= (str: string) => {
  return uuid(str)
}