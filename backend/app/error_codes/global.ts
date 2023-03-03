// Global error code range: 101-200
const globalErrorCodes = {
  REQUIRED_PARAMETERS_NOT_PROVIDED: {
    code: 101,
    msg: 'Required parameters are not provided.',
  },
  SERVER_UNKNOWN_ERROR: {
    code: 102,
    msg: 'Something wrong with server. Please wait for a second.',
  },
  AUTH_NOT_PERMITTED: {
    code: 103,
    msg: "You don't have access to process further steps."
  }
};

export default globalErrorCodes;
