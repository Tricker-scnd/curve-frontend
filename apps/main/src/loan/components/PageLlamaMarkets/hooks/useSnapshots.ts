import { LlamaMarket, LlamaMarketType } from '@/loan/entities/llama-markets'
import { LendingSnapshot, useLendingSnapshots } from '@/loan/entities/lending-snapshots'
import { CrvUsdSnapshot, useCrvUsdSnapshots } from '@/loan/entities/crvusd'
import { useMemo } from 'react'
import { meanBy } from 'lodash'

export type GraphType = 'borrow' | 'lend'

type UseSnapshotsResult<T> = {
  snapshots: T[] | null
  isLoading: boolean
  snapshotKey: keyof T
  rate: number | null
}

export function useSnapshots<T = CrvUsdSnapshot | LendingSnapshot>(
  { address, blockchainId, controllerAddress, type: marketType, rates }: LlamaMarket,
  type: GraphType,
): UseSnapshotsResult<T> {
  const isPool = marketType == LlamaMarketType.Pool
  const showMintGraph = !isPool && type === 'borrow'
  const contractAddress = isPool ? controllerAddress : address
  const params = { blockchainId: blockchainId, contractAddress }
  const { data: poolSnapshots, isLoading: poolIsLoading } = useLendingSnapshots(params, isPool)
  const { data: mintSnapshots, isLoading: mintIsLoading } = useCrvUsdSnapshots(params, showMintGraph)

  const currentValue = rates[type]
  const { snapshots, isLoading, snapshotKey } = isPool
    ? {
        snapshots: poolSnapshots ?? null,
        isLoading: poolIsLoading,
        snapshotKey: `${type}_apy` as const,
      }
    : {
        snapshots: (showMintGraph && mintSnapshots) || null,
        isLoading: mintIsLoading,
        snapshotKey: 'rate' as const,
      }

  const rate = useMemo(
    () => (snapshots?.length ? meanBy(snapshots as T[], (row) => row[snapshotKey as keyof T]) : (currentValue ?? null)),
    [snapshots, currentValue, snapshotKey],
  )

  return { snapshots, isLoading, snapshotKey, rate } as UseSnapshotsResult<T>
}
