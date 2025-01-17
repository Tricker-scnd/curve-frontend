import styled from 'styled-components'
import { HeathColorKey } from '@/types/loan.types'

export const HealthColorText = styled.span<{ colorKey?: HeathColorKey }>`
  color: ${({ colorKey }) => `var(--health_mode_${colorKey}--color)`};
`
