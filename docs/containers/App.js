import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { uploadFileAndTransform } from '../actions'

import FilePicker from '../components/FilePicker'
import LinkToCodeIconButton from '../components/LinkToCodeIconButton'
import WarningParagraph from '../components/WarningParagraph'

import AppBar from 'material-ui/AppBar'
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper';


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
        <AppBar
          title="私、猫になりたい人生だった"
          iconElementRight={
            <LinkToCodeIconButton
              href="https://github.com/rikitoro/naritaijinsei"
              tooltip="source code" />
          }
        />
        <h2> あなたの人生を猫にします </h2>
        <p> 時々失敗します。ご愛敬 </p>
        <p> 主演：あなたと聖福寺のねこさん </p>
        <hr />
        <h3> あなたの顔が写った画像を選択してください </h3>
        <FilePicker
          onChangeFiles={this.handleChangeFiles}
          disabled={isUploading || isTransforming}
        />
        <WarningParagraph>
          画像ファイルは一時的にサーバーへ保存されます。ご了承ください。(1日後に削除されます)
        </WarningParagraph>
        <hr />
        <br />
        {isUploading &&
          <div>
            <h3> 画像をアップロード中です </h3>
            <CircularProgress />
          </div>
        }
        {isUploadFailure &&
          <h3> 画像のアップロードに失敗しました </h3>
        }
        {isTransforming &&
          <div>
            <h3> 画像を変換中です </h3>
            <CircularProgress />
          </div>
        }
        {isTransformSuccess &&
          <img src={image_url} />
        }
        {isTransformFailure &&
          <h3> 画像の変換に失敗しました </h3>
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

///

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(App)