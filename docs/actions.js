import AWS from 'aws-sdk'
import UUID from 'uuid'
import $ from 'jquery'

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'ap-northeast-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:06a88243-bfb8-4122-8fc8-879c85b4be72'
});

export const UPLOAD_REQUEST = 'UPLOAD_REQUEST'
export const UPLOAD_SUCCESS = 'UPLOAD_SUCCESS'
export const UPLOAD_FAILURE = 'UPLOAD_FAILURE'
export const TRANSFORM_REQUEST = 'TRANSFORM_REQUEST'
export const TRANSFORM_SUCCESS = 'TRANSFORM_SUCCESS'
export const TRANSFORM_FAILURE = 'TRANSFORM_FAILURE'

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

function transformRequest() {
  return {
    type: TRANSFORM_REQUEST
  }
}

function transformSuccess(image_url) {
  return {
    type: TRANSFORM_SUCCESS,
    image_url
  }
}

function transformFaiuler() {
  return {
    type: TRANSFORM_FAILURE
  }
}



export function uploadFileAndTransform(file) {
  return dispatch => {
    const s3 = new AWS.S3();
    const filename = UUID.v4() + '-' + file.name
    const object = {
      Bucket: 'naritaijinsei',
      Key: 'input/' + filename,
      ContentType: file.type,
      Body: file
    }
    dispatch(uploadRequest(filename))
    s3.putObject(object, (error, data) => {
      if (error) {
        console.log("UPLOAD FAILURE: " + error)
        dispatch(uploadFailure(error))
      } else {
        console.log("UPLOAD SUCCESS: " + data)
        dispatch(uploadSuccess(data))
        //
        const api_endpoint = "https://2vddqdwgcl.execute-api.ap-northeast-1.amazonaws.com/beta"
        const param = {
          config: "neko_config_1.json",
          source_image: filename
        }
        dispatch(transformRequest())
        $.getJSON(api_endpoint, param)
        .then(
          (data) => {
            if (data.error) {
              dispatch(transformFaiuler())
              console.log("transform error: " + data.error)
            } else {
              dispatch(transformSuccess(data.image_url))
              console.log("image_url: " + data.image_url)
            }
          },
          (jqXHR, textStatus, errorThrown) => {
            dispatch(transformFaiuler())
            console.log("getJSON error: " + textStatus);
          }
        )
      }
    })
  }
}