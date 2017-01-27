import React, { Component, PropTypes } from 'react'
import Upload from 'material-ui-upload/Upload';

const FilePicker = ({ onChangeFiles, disabled }) => (
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      onChangeFiles(e.target.files)
    }}
    disabled={disabled}
  />
)

export default FilePicker
