// Upload related error code range: 2001-2002
const uploadErrorCodes = {
    UPLOAD_PARAMS_INVALID: {
      code: 2001,
      msg: 'Upload params are invalid. Please check the payload and headers.',
    },
    STREAM_TO_BUFFER_ERROR: {
      code: 2002,
      msg: 'Can not transform stream to buffer.',
    },
    UPLOAD_BUCKET_ERROR: {
      code: 2003,
      msg: 'Can not upload to bucket.',
    },
  };
  
  export default uploadErrorCodes;
  