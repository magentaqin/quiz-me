const bcrypt = require('bcrypt');

// hash password with salt
export const hashPassword = (password: string) => {
  const saltRounds = 10;
  return new Promise((resolve, reject) => {
    bcrypt.hash([password], saltRounds, function(err, hash) {
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