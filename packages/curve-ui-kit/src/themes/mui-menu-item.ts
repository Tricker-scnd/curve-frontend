import { DesignSystem } from '@ui-kit/themes/design'
import { SizesAndSpaces } from '@ui-kit/themes/design/1_sizes_spaces'
import type { Components } from '@mui/material/styles'
import { handleBreakpoints } from '@ui-kit/themes/basic-theme'

const { ButtonSize, Spacing } = SizesAndSpaces

export const definedMuiMenuItem = (design: DesignSystem): Components['MuiMenuItem'] => ({
  styleOverrides: {
    root: handleBreakpoints({
      height: ButtonSize.md,
      transition: design.Button.Transition,
      gap: Spacing.sm,
      paddingBlock: Spacing.xs,
      paddingInline: Spacing.sm,
    }),
    dense: {
      height: ButtonSize.sm,
    },
  },
})
