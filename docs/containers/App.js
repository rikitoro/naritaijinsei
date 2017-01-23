import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { uploadFileToS3 } from '../actions'
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
    dispatch(uploadFileToS3(files[0]))
  }

  render() {
    const { filename, isUploading, isUploadSuccess, isUploadFailure } = this.props
    return (
      <div>
        <FilePicker
          onChangeFiles={this.handleChangeFiles} />
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
      </div>
    )
  }

}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filename: PropTypes.string.isRequired,
  isUploading: PropTypes.bool.isRequired,
  isUploadSuccess: PropTypes.bool.isRequired,
  isUploadFailure: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(App)