import React, { Component, PropTypes } from 'react'

const FilePicker = ({ onChangeFiles }) => (
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      onChangeFiles(e.target.files)
    }}
  />
)

export default FilePicker
