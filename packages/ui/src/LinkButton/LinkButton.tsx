import type { ButtonProps } from 'ui/src/Button/types'
import type { LinkProps } from 'react-router-dom'

import * as React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { buttonBaseStyles } from 'ui/src/Button/styles'

interface Props extends ButtonProps, LinkProps {}

const LinkButton = ({ children, ...rest }: React.PropsWithChildren<Props>) => (
  <StyledLink {...rest}>{children}</StyledLink>
)

const StyledLink = styled(Link)<ButtonProps>`
  ${buttonBaseStyles};

  ${({ variant }) => {
    if (variant === 'filled') {
      return `
        align-items: center;
        display: flex;
        justify-content: center;
        text-decoration: none;
      `
    }
  }}
`

export default LinkButton
