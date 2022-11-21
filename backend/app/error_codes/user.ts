// User related error code range: 10001-10050 
const userErrorCodes = {
  USER_ALRREADY_EXIST: {
    code: 1001,
    msg: 'User Already Exist. Please login.'
  },
  USER_NAME_DUPLICATE: {
    code: 1002,
    msg: 'Duplicated Username. Please change your username.'
  },
  USER_EMAIL_PASSWORD_NOT_MATCH: {
    code: 1003,
    msg: 'Password is Not Matched with Email. Please retry.'
  },
  USER_NOT_EXIST: {
    code: 1004,
    msg: 'User Not Exist. Please check your email.'
  },
}

export default userErrorCodes
