import React, { Component, PropTypes } from 'react'

import IconButton from 'material-ui/IconButton'
import ActionCode from 'material-ui/svg-icons/action/code'
import {fullWhite} from 'material-ui/styles/colors'

const LinkToCodeIconButton = (prop) => (
  <IconButton
    {...prop}
    // tooltip={description}
    touch={true}
    tooltip={prop.tooltip || "Link to code"}
    tooltipPosition={prop.tooltipPosition || "bottom-left"}
    // href={href}
  >
    <ActionCode color={fullWhite} />
  </IconButton>
)

export default LinkToCodeIconButton