import { ChainSwitcherProps } from '@ui-kit/features/switch-chain'
import { ConnectWalletIndicatorProps } from '@ui-kit/features/connect-wallet'
import { RefObject } from 'react'
import { AppName } from '@ui-kit/shared/routes'
import { GlobalBannerProps } from '@ui/Banner/GlobalBanner'

export type Locale = 'en' | 'zh-Hans' | 'zh-Hant' | 'pseudo'

export type AppPage = {
  route: string
  label: string
  isActive?: boolean
  target?: '_self' | '_blank' // note this is only used for external routes
}

export type AppRoute = {
  route: string
  label: () => string // lazy evaluation for translations
  target?: '_self' | '_blank' // note this is only used for external routes
}

export type AppRoutes = {
  root: string
  label: string
  pages: AppRoute[]
}

export type NavigationSection = {
  title: string
  links: AppPage[]
}

export type BaseHeaderProps<TChainId = number> = {
  mainNavRef: RefObject<HTMLDivElement>
  currentApp: AppName
  isLite?: boolean
  ChainProps: Omit<ChainSwitcherProps<TChainId>, 'headerHeight'>
  WalletProps: ConnectWalletIndicatorProps
  BannerProps: GlobalBannerProps
  height: string
  pages: AppPage[]
  sections: NavigationSection[]
  appStats?: { label: string; value: string }[]
  networkName: string
}

export type HeaderProps<TChainId> = BaseHeaderProps<TChainId> & {
  isMdUp: boolean
}

export const APP_NAMES = {
  main: 'Curve',
  lend: 'LLAMALEND',
  crvusd: 'crvUSD',
  dao: 'DAO',
} as const
