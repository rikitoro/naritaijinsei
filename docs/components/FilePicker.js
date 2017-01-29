import React, { Component, PropTypes } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import ImagePhotoCamera from 'material-ui/svg-icons/image/photo-camera'

const FilePicker = ({ onChangeFiles, disabled }) => (
  <RaisedButton
    containerElement="label"
    label="画像ファイルを選択"
    labelPosition="before"
    icon={<ImagePhotoCamera />}
    primary={true}
    disabled={disabled}
  >
    <input
      type="file"
      accept="image/*"
      style={{display: "none"}}
      onChange={(e) => {
        onChangeFiles(e.target.files)
      }}
      disabled={disabled}
    />
  </RaisedButton>
)

export default FilePicker
