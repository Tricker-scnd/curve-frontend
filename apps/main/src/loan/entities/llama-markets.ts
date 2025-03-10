import { Assets, getLendingVaultOptions, LendingVaultFromApi } from '@/loan/entities/lending-vaults'
import { useQueries } from '@tanstack/react-query'
import { getMintMarketOptions, MintMarket } from '@/loan/entities/mint-markets'
import { combineQueriesMeta, PartialQueryResult } from '@ui-kit/lib'

export enum LlamaMarketType {
  Mint = 'mint',
  Pool = 'pool',
}

export type LlamaMarket = {
  blockchainId: string
  address: string
  controllerAddress: string
  assets: Assets
  utilizationPercent: number
  totalSupplied: {
    total: number
    usdTotal: number
  }
  rates: {
    lend?: number // apy %, only for pools
    borrow: number // apy %
  }
  type: LlamaMarketType
}

const convertLendingVault = ({
  controllerAddress,
  blockchainId,
  totalSupplied,
  assets,
  address,
  rates,
  borrowed,
}: LendingVaultFromApi): LlamaMarket => ({
  blockchainId: blockchainId,
  address: address,
  controllerAddress: controllerAddress,
  assets: assets,
  utilizationPercent: (100 * borrowed.usdTotal) / totalSupplied.usdTotal,
  totalSupplied: totalSupplied,
  rates: {
    lend: rates.lendApyPcent,
    borrow: rates.borrowApyPcent,
  },
  type: LlamaMarketType.Pool,
})

const convertMintMarket = (
  {
    address,
    collateral_token,
    stablecoin_token,
    llamma,
    rate,
    total_debt,
    debt_ceiling,
    collateral_amount,
    collateral_amount_usd,
    stablecoin_price,
  }: MintMarket,
  blockchainId: string,
): LlamaMarket => ({
  blockchainId,
  address,
  controllerAddress: llamma,
  assets: {
    borrowed: {
      symbol: stablecoin_token.symbol,
      address: stablecoin_token.address,
      usdPrice: stablecoin_price,
      blockchainId,
    },
    collateral: {
      symbol: collateral_token.symbol,
      address: collateral_token.address,
      usdPrice: collateral_amount_usd / collateral_amount,
      blockchainId,
    },
  },
  utilizationPercent: (100 * total_debt) / debt_ceiling,
  totalSupplied: {
    // todo: do we want to see collateral or borrowable?
    total: collateral_amount,
    usdTotal: collateral_amount_usd,
  },
  rates: {
    borrow: rate * 100,
  },
  type: LlamaMarketType.Mint,
})

export const useLlamaMarkets = () =>
  useQueries({
    queries: [getLendingVaultOptions({}), getMintMarketOptions({})],
    combine: ([lendingVaults, mintMarkets]): PartialQueryResult<LlamaMarket[]> => ({
      ...combineQueriesMeta([lendingVaults, mintMarkets]),
      data: [
        ...(lendingVaults.data?.lendingVaultData ?? [])
          .filter((vault) => vault.totalSupplied.usdTotal)
          .map(convertLendingVault),
        ...(mintMarkets.data ?? []).flatMap(({ chain, data }) => data.map((i) => convertMintMarket(i, chain))),
      ],
    }),
  })
