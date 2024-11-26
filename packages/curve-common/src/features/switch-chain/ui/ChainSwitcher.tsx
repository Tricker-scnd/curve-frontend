import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import { useCallback, useMemo } from 'react'
import Typography from '@mui/material/Typography'
import { CompactDropDown } from 'curve-ui-kit/src/shared/ui/CompactDropDown'
import Image from 'next/image'
import { ThemeKey } from 'curve-ui-kit/src/themes/basic-theme'

export type ChainOption<TChainId> = {
  chainId: TChainId
  label: string
  src: string
  srcDark: string
}

export type ChainSwitcherProps<TChainId> = {
  chainId: TChainId
  options: ChainOption<TChainId>[]
  onChange: (chainId: TChainId) => void
  disabled?: boolean
  theme: ThemeKey
}

export const ChainIcon = ({ label, src, size }: { label: string; src: string; size: number }) => (
  <Box component="span" alignItems="center" display="flex" marginRight="0.25rem">
    <Image
      alt={label}
      // onError={(evt) => (evt.target as HTMLImageElement).src = src}
      src={src}
      loading="lazy"
      width={size}
      height={size}
    />
  </Box>
)

export const ChainSwitcher = <TChainId extends number>({
  options,
  chainId,
  onChange,
  disabled,
}: ChainSwitcherProps<TChainId>) => {
  const networkMapping = useMemo(
    () =>
      options.reduce(
        (acc, option) => ({ ...acc, [option.chainId]: option }),
        {} as Record<TChainId, ChainOption<TChainId>>,
      ),
    [options],
  )

  const renderChainIcon = useCallback(
    (value: TChainId) => {
      const { label, src } = networkMapping[value]
      return <ChainIcon size={28} label={label} src={src} />
    },
    [networkMapping],
  )

  if (options.length <= 1) {
    return null
  }

  return (
    <CompactDropDown<TChainId> value={chainId} onChange={onChange} disabled={disabled} renderValue={renderChainIcon}>
      {options.map(({ chainId: id, src, label }) => (
        <MenuItem key={id} value={id} divider>
          <ChainIcon size={18} label={label} src={src} />
          <Typography sx={{ marginLeft: 4 }} variant="headingXs">
            {label}
          </Typography>
        </MenuItem>
      ))}
    </CompactDropDown>
  )
}
