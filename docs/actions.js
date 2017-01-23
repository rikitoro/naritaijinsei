import AWS from 'aws-sdk'

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'ap-northeast-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:06a88243-bfb8-4122-8fc8-879c85b4be72'
});

export const UPLOAD_REQUEST = 'UPLOAD_REQUEST'
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS'
export const UPLOAD_FAILURE = 'UPLOAD_FAILURE'

function uploadRequest(filename) {
  return {
    type: UPLOAD_REQUEST,
    filename
  }
}

function uploadSuccess(data) {
  return {
    type: UPLOAD_SUCCESS,
    data
  }
}

function uploadFailure(error) {
  return {
    type: UPLOAD_FAILURE,
    error
  }
}

export function uploadFileToS3(file) {
  return dispatch => {
    const s3 = new AWS.S3();
    const object = {
      Bucket: 'naritaijinsei',
      Key: 'input/' + file.name,
      ContentType: file.type,
      Body: file
    }
    dispatch(uploadRequest(file.name))
    s3.putObject(object, (error, data) => {
      if (error) {
        console.log("UPLOAD FAILURE: " + error)
        dispatch(uploadFailure(error))
      } else {
        console.log("UPLOAD SUCCESS: " + data)
        dispatch(uploadSuccess(data))
      }
    })
  }
}