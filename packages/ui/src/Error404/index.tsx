import styled from 'styled-components'

import { CURVE_ASSETS_URL } from 'ui/src/utils'
import { breakpoints } from 'ui/src/utils/responsive'
import Box from 'ui/src/Box'
import Image from 'next/image'

export function Error404() {
  return (
    <Container variant="secondary">
      <Image src={`${CURVE_ASSETS_URL}/branding/four-oh-llama.jpg`} alt="404" layout="fill" />
      <Title>404</Title>
      <Description>Page not found</Description>
    </Container>
  )
}

const Description = styled.p`
  font-size: 2rem;
  z-index: 1;
  opacity: 0.9;
`

const Title = styled.h2`
  font-size: 9rem;
  line-height: 1;
  z-index: 1;
  opacity: 0.9;

  @media (min-width: ${breakpoints.sm}rem) {
    font-size: 10rem;
  }
`

const Container = styled(Box)`
  align-items: center;
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: calc(100vh - var(--header-height));
  justify-content: center;
  border: none;

  @media (min-width: ${breakpoints.md}rem) {
    margin: 1.5rem;
    min-height: 56vh;
  }
`

export default Error404
