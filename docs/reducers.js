import {
  UPLOAD_REQUEST, UPLOAD_SUCCESS, UPLOAD_FAILURE
} from './actions'

const initial_state = {
  filename: "",
  isUploading: false,
  isUploadSuccess: false,
  isUploadFailure: false
}

export default function reducer(state = initial_state, action) {
  switch (action.type) {
    case UPLOAD_REQUEST:
      return {
        filename: action.filename,
        isUploading: true,
        isUploadSuccess: false,
        isUploadFailure: false
      }
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
    default:
      return state
  }
}