import React, { Component, PropTypes } from 'react'

import AlertWarning from 'material-ui/svg-icons/alert/warning'
import {grey500} from 'material-ui/styles/colors'

const WarningParagraph = (prop) => (
<p {...prop}>
  <AlertWarning color={prop.color || grey500}/>
  {' '}
  {prop.children}
</p>
)

export default WarningParagraph