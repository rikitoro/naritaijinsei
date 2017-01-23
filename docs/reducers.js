import {
  UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE,
  TRANSFORM_REQUEST, TRANSFORM_SUCCESS, TRANSFORM_FAILURE
} from './actions'

const initial_state = {
  filename: "",
  isUploading: false,
  isUploadSuccess: false,
  isUploadFailure: false,
  isTransforming: false,
  isTransformSuccess: false,
  isTransformFailure: false,
  image_url: ""
}

export default function reducer(state = initial_state, action) {
  switch (action.type) {
    case UPLOAD_REQUEST:
      return Object.assign({}, initial_state, {
        filename: action.filename,
        isUploading: true,
      })
    case UPLOAD_SUCCESS:
      return Object.assign({}, state, {
        isUploading: false,
        isUploadSuccess: true,
        isUploadFailure: false
      })
    case UPLOAD_FAILURE:
      return Object.assign({}, state, {
        isUploading: false,
        isUploadSuccess: false,
        isUploadFailure: true
      })
    case TRANSFORM_REQUEST:
      return Object.assign({}, state, {
        isTransforming: true,
        isTransformSuccess: false,
        isTransformFailure: false
      })
    case TRANSFORM_SUCCESS:
      return Object.assign({}, state, {
        isTransforming: false,
        isTransformSuccess: true,
        isTransformFailure: false,
        image_url: action.image_url
      })
    case TRANSFORM_FAILURE:
      return Object.assign({}, state, {
        isTransforming: false,
        isTransformSuccess: false,
        isTransformFailure: true
      })
    default:
      return state
  }
}