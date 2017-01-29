import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { uploadFileAndTransform } from '../actions'

import FilePicker from '../components/FilePicker'
import LinkToCodeIconButton from '../components/LinkToCodeIconButton'

import AppBar from 'material-ui/AppBar'
import CircularProgress from 'material-ui/CircularProgress'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'



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
        <Card>
          <CardText>
            あなたの顔が写った画像をアップロード
          </CardText>
          <CardActions>
            <FilePicker
              onChangeFiles={this.handleChangeFiles}
              disabled={isUploading || isTransforming}
            />
          </CardActions>
          {isUploading &&
            <CardText>
              画像をアップロード中です
              <CircularProgress />
            </CardText>
          }
          {isUploadFailure &&
            <CardText>
              画像のアップロードに失敗しました
            </CardText>
          }
          {isTransforming &&
            <CardText>
              画像を変換中です
              <CircularProgress />
            </CardText>
          }
          {isTransformSuccess &&
            <CardMedia>
              <img src={image_url} />
            </CardMedia>
          }
          {isTransformFailure &&
            <CardText>
              画像の変換に失敗しました
            </CardText>
          }
        </Card>
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