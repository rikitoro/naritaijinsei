import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { uploadFileAndTransform } from '../actions'
import FilePicker from '../components/FilePicker'

class App extends Component {
  constructor(props) {
    super(props)
    this.handleChangeFiles = this.handleChangeFiles.bind(this)
  }

  handleChangeFiles(files) {
    if (files.length === 0) {
      return
    }

    const { dispatch } = this.props
    dispatch(uploadFileAndTransform(files[0]))
  }

  render() {
    const { filename, image_url,
      isUploading, isUploadSuccess, isUploadFailure,
      isTransforming, isTransformSuccess, isTransformFailure } = this.props
    return (
      <div>
        <FilePicker
          onChangeFiles={this.handleChangeFiles}
          disabled={isUploading || isTransforming} />
        {filename &&
          <h2> filename: {filename} </h2>
        }
        {isUploading &&
          <h2> Now uploading </h2>
        }
        {isUploadFailure &&
          <h2> Upload failure </h2>
        }
        {isUploadSuccess &&
          <h2> Upload success </h2>
        }
        {isTransforming &&
          <h2> Now transforming your image </h2>
        }
        {isTransformSuccess &&
          <div>
            <h2> Image Url: {image_url} </h2>
            <img src={image_url} />
          </div>
        }
        {isTransformFailure &&
          <h2> Image Transfrom Failure </h2>
        }
      </div>
    )
  }

}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filename: PropTypes.string.isRequired,
  image_url: PropTypes.string.isRequired,
  isUploading: PropTypes.bool.isRequired,
  isUploadSuccess: PropTypes.bool.isRequired,
  isUploadFailure: PropTypes.bool.isRequired,
  isTransforming: PropTypes.bool.isRequired,
  isTransformSuccess: PropTypes.bool.isRequired,
  isTransformFailure: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(App)