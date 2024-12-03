import { type TypographyOptions } from '@mui/material/styles/createTypography'
import { basicMuiTheme } from '../basic-theme'
import { SizesAndSpaces } from '../design/1_sizes_spaces'
import { Sizing } from '../design/0_primitives'
import { DesignSystem } from '../design'
import { Fonts } from './fonts'

const disabledTypographyKeys = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'button',
  'body1',
  'body2',
  'caption',
  'overline',
  'subtitle1',
  'subtitle2',
] as const

const { LineHeight, FontWeight, FontSize } = SizesAndSpaces.Typography

type ButtonSize = {
  fontFamily: keyof DesignSystem['Text']['FontFamily']
  fontSize: string | keyof typeof FontSize
  fontWeight?: keyof typeof FontWeight
  lineHeight?: string | keyof typeof LineHeight
  letterSpacing?: string
  textCase?: 'uppercase' | 'capitalize'
  marginBottom?: number
}

const variant = ({ fontFamily, fontSize, fontWeight, lineHeight, letterSpacing = '0%', textCase, marginBottom }: ButtonSize) => {
  const fontSize1 = FontSize[fontSize as keyof typeof FontSize] ?? fontSize
  return {
    fontFamily,
    fontSize: fontSize1,
    fontWeight: FontWeight[fontWeight ?? 'Medium'],
    lineHeight: LineHeight[(lineHeight ?? fontWeight) as keyof typeof LineHeight] ?? lineHeight,
    letterSpacing: `calc(${letterSpacing} * ${fontSize1})`,
    marginBottom,
    textTransform: textCase,
  }
}

// prettier-ignore
export const TYPOGRAPHY_VARIANTS = {
  headingXxl: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: 'xxl', letterSpacing: '-4%' }),
  headingMBold: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: 'xl', lineHeight: Sizing[450], letterSpacing: '-4%', textCase: 'uppercase', marginBottom: 72 }),
  headingMLight: variant({ fontFamily: 'Heading', fontWeight: 'Normal', fontSize: 'xl', lineHeight: Sizing[450], letterSpacing: '-4%', textCase: 'uppercase' }),
  headingSBold: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: 'lg', letterSpacing: '-2%', textCase: 'uppercase', marginBottom: 16 }),
  headingXsBold: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: 'sm', textCase: 'uppercase' }),
  headingXsMedium: variant({ fontFamily: 'Heading', fontSize: 'sm', textCase: 'capitalize' }),

  bodyMRegular: variant({ fontFamily: 'Body', fontSize: 'md', marginBottom: 12 }),
  bodyMBold: variant({ fontFamily: 'Body', fontWeight: 'Bold', fontSize: 'md', marginBottom: 12 }),
  bodySRegular: variant({ fontFamily: 'Body', fontSize: 'sm', marginBottom: 8 }),
  bodySBold: variant({ fontFamily: 'Body', fontWeight: 'Bold', fontSize: 'sm', marginBottom: 8 }),
  bodyXsRegular: variant({ fontFamily: 'Body', fontSize: 'xs', marginBottom: 8 }),
  bodyXsBold: variant({ fontFamily: 'Body', fontWeight: 'Bold', fontSize: 'xs', marginBottom: 8 }),

  buttonXs: variant({ fontFamily: 'Button', fontWeight: 'Bold', fontSize: 'sm' }),
  buttonS: variant({ fontFamily: 'Button', fontWeight: 'Bold', fontSize: 'sm', lineHeight: 'md', textCase: 'uppercase', marginBottom: 20 }),
  buttonM: variant({ fontFamily: 'Button', fontWeight: 'Bold', fontSize: 'md', lineHeight: 'xl', textCase: 'uppercase' }),

  tableHeaderM: variant({ fontFamily: 'Body', fontSize: 'md', lineHeight: 'sm', marginBottom: 16 }),
  tableHeaderS: variant({ fontFamily: 'Body', fontSize: 'sm', lineHeight: 'xs', marginBottom: 14 }),
  tableCellL: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: Sizing[250], lineHeight: Sizing[250] }),
  tableCellMRegular: variant({ fontFamily: 'Mono', fontSize: 'md', lineHeight: 'sm' }),
  tableCellMBold: variant({ fontFamily: 'Mono', fontWeight: 'Bold', fontSize: 'md', lineHeight: 'sm' }),
  tableCellSRegular: variant({ fontFamily: 'Mono', fontSize: 'sm', lineHeight: 'xs' }),
  tableCellSBold: variant({ fontFamily: 'Mono', fontWeight: 'Bold', fontSize: 'sm', lineHeight: 'xs' }),

  highlightXsNotional: variant({ fontFamily: 'Mono', fontSize: 'xs' }),
  highlightXs: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: 'xs' }),
  highlightS: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: 'sm' }),
  highlightM: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: 'md', lineHeight: 'sm' }),
  highlightL: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: 'lg', lineHeight: 'md' }),
  highlightXl: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: 'xl', lineHeight: Sizing[450], letterSpacing: '-4%' }),
  highlightXxl: variant({ fontFamily: 'Heading', fontWeight: 'Bold', fontSize: 'xxl', letterSpacing: '-4%' }),
}

export const createTypography = ({ Text }: DesignSystem) => ({
  fontFamily: Fonts[Text.FontFamily.Body],
  fontWeightBold: FontWeight.Bold,
  fontWeightMedium: FontWeight.Medium,
  fontWeightRegular: FontWeight.Normal,
  fontWeightLight: FontWeight.Light,
  fontSize: 16,
  [basicMuiTheme.breakpoints.down('tablet')]: {
    fontSize: 12,
  },
  ...disabledTypographyKeys.reduce((acc, variant) => ({ ...acc, [variant]: undefined }), {} as TypographyOptions),
  ...Object.fromEntries(
    Object.entries(TYPOGRAPHY_VARIANTS).map(([key, { fontFamily, ...value }]) => [
      key,
      { ...value, fontFamily: Fonts[Text.FontFamily[fontFamily]] },
    ]),
  ),
}) as TypographyOptions

export type DisabledTypographyVariantKey = typeof disabledTypographyKeys
export type TypographyVariantKey = keyof typeof TYPOGRAPHY_VARIANTS
