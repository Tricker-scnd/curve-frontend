import type { IDict, IChainId, INetworkName } from '@curvefi/api/lib/interfaces'
import type { SearchParams as PoolListSearchParams } from '@/dex/components/PagePoolList/types'
import type { Location, NavigateFunction, Params } from 'react-router'
import type { PoolTemplate } from '@curvefi/api/lib/pools'
import type { TooltipProps } from '@ui/Tooltip/types'
import type { WalletState } from '@web3-onboard/core'
import type { Locale } from '@ui-kit/lib/i18n'
import type { BaseConfig } from '@ui/utils'
import type curveApi from '@curvefi/api'
import { ethers } from 'ethers'
import React from 'react'
import { IGaugePool } from '@curvefi/api/lib/pools/subClasses/gaugePool'

export type Balances = IDict<string>
export type Balance = string | IDict<string>
export type CurveApi = typeof curveApi & { chainId: IChainId }
export type ChainId = IChainId | number
export type NetworkEnum = INetworkName
export type NetworkConfigFromApi = {
  hasDepositAndStake: boolean | undefined
  hasRouter: boolean | undefined
}

export interface NetworkConfig extends BaseConfig {
  isLite: boolean
  useApi: boolean
  excludePoolsMapper: { [key: string]: boolean }
  excludeTokensBalancesMapper: { [tokenAddress: string]: boolean }
  poolCustomTVL: { [poolAddress: string]: string }
  poolIsWrappedOnly: { [poolAddress: string]: boolean }
  poolFilters: string[]
  hideSmallPoolsTvl: number
  isActiveNetwork: boolean
  missingPools: { name: string; url: string }[]
  poolListFormValuesDefault: Partial<PoolListSearchParams>
  swap: { [key: string]: string }
  showInSelectNetwork: boolean
  showRouterSwap: boolean
  swapCustomRouteRedirect: {
    [key: string]: string
  }
  createQuickList: {
    address: string
    haveSameTokenName: boolean
    symbol: string
  }[]
  createDisabledTokens: string[]
  stableswapFactoryOld: boolean
  stableswapFactory: boolean
  twocryptoFactoryOld: boolean
  twocryptoFactory: boolean
  tricryptoFactory: boolean
  hasFactory: boolean
  pricesApi: boolean
}

export type NetworkAliases = { crv: string }
export type NativeToken = { symbol: string; wrappedSymbol: string; address: string; wrappedAddress: string }
export type Networks = Record<ChainId, NetworkConfig>
export type CurrencyReservesToken = {
  token: string
  tokenAddress: string
  balance: number
  balanceUsd: number
  usdRate: number
  percentShareInPool: string
}
export type CurrencyReserves = {
  poolId: string
  tokens: CurrencyReservesToken[]
  total: string
  totalUsd: string
}
export type CurrencyReservesMapper = { [chainPoolId: string]: CurrencyReserves }
export type RFormType = 'deposit' | 'withdraw' | 'swap' | 'adjust_crv' | 'adjust_date' | 'create' | 'manage-gauge' | ''
export type RouterParams = {
  rLocale: Locale | null
  rLocalePathname: string
  rChainId: ChainId
  rNetwork: NetworkEnum
  rNetworkIdx: number
  rSubdirectory: string
  rSubdirectoryUseDefault: boolean
  rPoolId: string
  rFormType: RFormType
  redirectPathname: string
  restFullPathname: string
}
export type PageProps = {
  curve: CurveApi | null
  pageLoaded: boolean
  routerParams: RouterParams
}
export type Pool = PoolTemplate
export type Provider = ethers.BrowserProvider
export type ClaimableReward = {
  token: string
  symbol: string
  amount: string
  price: number
}
export type RewardBase = {
  day: string
  week: string
}
export type RewardCrv = number
export type RewardOther = {
  apy: number
  decimals?: number
  gaugeAddress: string
  name?: string
  symbol: string
  tokenAddress: string
  tokenPrice?: number
}
export type RewardsApy = {
  poolId: string
  base: RewardBase
  other: RewardOther[]
  crv: RewardCrv[]
  error: { [rewardType: string]: boolean }
}
export type RewardsApyMapper = { [poolId: string]: RewardsApy }
export type PoolParameters = {
  A: string
  adminFee: string
  fee: string
  future_A?: string
  future_A_time?: number
  gamma?: string
  initial_A?: string
  initial_A_time?: number
  lpTokenSupply: string
  priceOracle?: string[]
  priceScale?: string[]
  virtualPrice: string
}
export type Token = {
  address: string
  ethAddress?: string
  symbol: string
  decimals: number
  haveSameTokenName: boolean // use to display token address if duplicated token names
  volume?: number
}
export type TokensMapper = { [tokenAddress: string]: Token | undefined }
export type TokensNameMapper = { [tokenAddress: string]: string }
export type UserBalancesMapper = { [tokenAddress: string]: string | undefined }
export type GaugeStatus = { rewardsNeedNudging: boolean; areCrvRewardsStuckInBridge: boolean }

export interface Gauge {
  status: GaugeStatus | null
  isKilled: boolean | null
}

export interface PoolData {
  idx?: number
  chainId: ChainId
  pool: Pool
  gauge: Gauge
  hasWrapped: boolean
  hasVyperVulnerability: boolean
  isWrapped: boolean
  currenciesReserves: CurrencyReserves | null
  parameters: PoolParameters
  tokenAddresses: string[]
  tokenAddressesAll: string[]
  tokenDecimalsAll: number[]
  tokens: string[]
  tokensCountBy: { [key: string]: number }
  tokensAll: string[]
  tokensLowercase: string[]
  curvefiUrl: string
  failedFetching24hOldVprice: boolean
}

export type BasePool = {
  id: string
  name: string
  token: string
  pool: string
  coins: string[]
}
export type PoolDataMapper = { [poolAddress: string]: PoolData }
export type PoolDataCache = {
  gauge: Gauge
  hasWrapped: boolean
  hasVyperVulnerability: boolean
  tokenAddresses: string[]
  tokenAddressesAll: string[]
  tokens: string[]
  tokensCountBy: { [key: string]: number }
  tokensAll: string[]
  tokensLowercase: string[]
  pool: {
    id: string
    name: string
    address: string
    gauge: IGaugePool
    lpToken: string
    isCrypto: boolean
    isNg: boolean
    isFactory: boolean
    isLending: boolean
    implementation: string
    referenceAsset: string
  }
}
export type PricesApiPoolData = {
  name: string
  registry: string
  lp_token_address: string
  coins: {
    pool_index: number
    symbol: string
    address: string
  }[]
  pool_type: string
  metapool: boolean | null
  base_pool: string | null
  asset_types: number[]
  oracles: {
    oracle_address: string
    method_id: string
    method: string
  }[]
  vyper_version: string
}
export type SnapshotsMapper = { [poolAddress: string]: PricesApiSnapshotsData }
export type PricesApiSnapshotsData = {
  timestamp: number
  a: number
  fee: number
  admin_fee: number
  virtual_price: number
  xcp_profit: number
  xcp_profit_a: number
  base_daily_apr: number
  base_weekly_apr: number
  offpeg_fee_multiplier: number
  gamma: number
  mid_fee: number
  out_fee: number
  fee_gamma: number
  allowed_extra_profit: number
  adjustment_step: number
  ma_half_time: number
  price_scale: number[]
  price_oracle: number[]
  block_number: number
}
export type PricesApiSnapshotsResponse = {
  address: string
  chain: string
  data: PricesApiSnapshotsData[]
}
export type PoolDataCacheMapper = { [poolAddress: string]: PoolDataCache }
export type PoolDataCacheOrApi = PoolData | PoolDataCache
export type PageWidthClassName =
  | 'page-wide'
  | 'page-large'
  | 'page-medium'
  | 'page-small'
  | 'page-small-x'
  | 'page-small-xx'
export type RouterProps = {
  params: Params
  location: Location
  navigate: NavigateFunction
}
export type Tvl = {
  poolId: string
  value: string
  errorMessage: string
}
export type TvlMapper = { [poolId: string]: Tvl }
export type UsdRatesMapper = { [tokenAddress: string]: number | undefined }
export type UserPoolListMapper = { [poolId: string]: boolean }
export type Volume = {
  poolId: string
  value: string
  errorMessage: string
}
export type VolumeMapper = { [poolId: string]: Volume }
export type Wallet = WalletState
export type AlertType = 'info' | 'warning' | 'error' | 'danger' | ''

export interface PoolAlert extends TooltipProps {
  alertType: AlertType
  isDisableDeposit?: boolean
  isDisableSwap?: boolean
  isInformationOnly?: boolean
  isInformationOnlyAndShowInForm?: boolean
  isCloseOnTooltipOnly?: boolean
  isPoolPageOnly?: boolean // Don't show the pools overview table
  address?: string
  message: string | React.ReactNode
}

export type EstimatedGas = number | number[] | null
export type GasInfo = {
  gasPrice: number | null
  max: number[]
  priority: number[]
  basePlusPriority: number[]
  basePlusPriorityL1?: number[] | undefined
  l1GasPriceWei?: number
  l2GasPriceWei?: number
}

export interface FnStepEstGasApprovalResponse {
  activeKey: string
  isApproved: boolean
  estimatedGas: EstimatedGas
  error: string
}

export interface FnStepApproveResponse {
  activeKey: string
  hashes: string[]
  error: string
}

export interface FnStepResponse {
  activeKey: string
  hash: string
  error: string
}
