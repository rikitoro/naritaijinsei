import React, { Component, PropTypes } from 'react'

import IconButton from 'material-ui/IconButton'
import ActionCode from 'material-ui/svg-icons/action/code'
import {fullWhite} from 'material-ui/styles/colors'

const LinkToSourceIconButton = ({ description, href }) => (
  <IconButton
    tooltip={description}
    touch={true}
    tooltipPosition="bottom-left"
    href={href}
  >
    <ActionCode color={fullWhite} />
  </IconButton>
)

export default LinkToSourceIconButton