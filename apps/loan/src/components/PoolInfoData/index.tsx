import type {
  PricesApiPool,
  PricesApiCoin,
  LabelList,
  LlammaLiquididationRange,
  LiquidationRange,
} from '@/ui/Chart/types'
import { LlammaLiquidityCoins } from './types'

import { useEffect, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { t } from '@lingui/macro'

import useStore from '@/store/useStore'
import { getThreeHundredResultsAgo, subtractTimeUnit } from '@/ui/Chart/utils'

import Button from '@/ui/Button'
import ChartWrapper from '@/ui/Chart'
import Icon from '@/ui/Icon'
import Box from '@/ui/Box'
import PoolActivity from '@/components/PoolInfoData/PoolActivity'

type Props = {
  rChainId: ChainId
  llamma: Llamma | null
}

const PoolInfoData = ({ rChainId, llamma }: Props) => {
  const address = llamma?.address ?? ''
  const themeType = useStore((state) => state.themeType)
  const { formValues, activeKeyLiqRange } = useStore((state) => state.loanCreate)
  const liqRangesMapper = useStore((state) => state.loanCreate.liqRangesMapper[activeKeyLiqRange])
  const isMdUp = useStore((state) => state.layout.isMdUp)
  const {
    chartFetchStatus,
    activityFetchStatus,
    timeOption,
    refetchingHistory,
    refetchingCapped,
    lastFetchEndTime,
    lastRefetchLength,
    chartOhlcData,
    volumeData,
    oraclePriceData,
    setChartTimeOption,
    fetchOhlcData,
    fetchMoreOhlcData,
    setActivityHidden,
    activityHidden,
    chartExpanded,
    setChartExpanded,
  } = useStore((state) => state.ohlcCharts)
  const [poolInfo, setPoolInfo] = useState<'chart' | 'poolActivity'>('chart')

  const selectedLiqRange = useMemo(() => {
    if (formValues.n && liqRangesMapper && chartOhlcData) {
      const prices = liqRangesMapper[formValues.n].prices
      let price1: LiquidationRange = []
      let price2: LiquidationRange = []
      for (const data of chartOhlcData) {
        price1 = [
          ...price1,
          {
            time: data.time,
            value: +prices[0],
          },
        ]
        price2 = [
          ...price2,
          {
            time: data.time,
            value: +prices[1],
          },
        ]
      }
      return { price1, price2 }
    }
  }, [chartOhlcData, formValues.n, liqRangesMapper])

  const coins: LlammaLiquidityCoins = llamma
    ? {
        crvusd: {
          symbol: llamma?.coins[0],
          address: llamma?.coinAddresses[0],
        },
        collateral: {
          symbol: llamma?.coins[1],
          address: llamma?.coinAddresses[1],
        },
      }
    : null

  const chartHeight = {
    expanded: 500,
    standard: 300,
  }

  const chartTimeSettings = useMemo(() => {
    const threeHundredResultsAgo = getThreeHundredResultsAgo(timeOption, Date.now() / 1000)

    return {
      start: +threeHundredResultsAgo,
      end: Math.floor(Date.now() / 1000),
    }
  }, [timeOption])

  const chartInterval = useMemo(() => {
    if (timeOption === '15m') return 15
    if (timeOption === '30m') return 30
    if (timeOption === '1h') return 1
    if (timeOption === '4h') return 4
    if (timeOption === '6h') return 6
    if (timeOption === '12h') return 12
    if (timeOption === '1d') return 1
    if (timeOption === '7d') return 7
    return 14 // 14d
  }, [timeOption])

  const timeUnit = useMemo(() => {
    if (timeOption === '15m') return 'minute'
    if (timeOption === '30m') return 'minute'
    if (timeOption === '1h') return 'hour'
    if (timeOption === '4h') return 'hour'
    if (timeOption === '6h') return 'hour'
    if (timeOption === '12h') return 'hour'
    if (timeOption === '1d') return 'day'
    if (timeOption === '7d') return 'day'
    return 'day' // 14d
  }, [timeOption])

  const refetchPricesData = () => {
    fetchOhlcData(rChainId, address, chartInterval, timeUnit, chartTimeSettings.start, chartTimeSettings.end)
  }

  // set snapshot data and subscribe to new data
  useEffect(() => {
    if (llamma !== undefined) {
      fetchOhlcData(rChainId, address, chartInterval, timeUnit, chartTimeSettings.start, chartTimeSettings.end)
    }
  }, [
    rChainId,
    chartInterval,
    chartTimeSettings.end,
    chartTimeSettings.start,
    timeUnit,
    fetchOhlcData,
    address,
    llamma,
  ])

  const fetchMoreChartData = useCallback(() => {
    const endTime = subtractTimeUnit(timeOption, lastFetchEndTime)
    const startTime = getThreeHundredResultsAgo(timeOption, endTime)

    fetchMoreOhlcData(rChainId, address, chartInterval, timeUnit, endTime, +startTime)
  }, [timeOption, lastFetchEndTime, fetchMoreOhlcData, rChainId, address, chartInterval, timeUnit])

  return chartExpanded ? (
    <ExpandedWrapper activityHidden={activityHidden}>
      <Wrapper variant={'secondary'} chartExpanded={chartExpanded}>
        <ChartWrapper
          chartType="crvusd"
          chartStatus={llamma ? chartFetchStatus : 'LOADING'}
          chartHeight={chartHeight}
          chartExpanded={chartExpanded}
          themeType={themeType}
          ohlcData={chartOhlcData}
          volumeData={volumeData}
          oraclePriceData={oraclePriceData}
          liquidationRange={selectedLiqRange}
          timeOption={timeOption}
          selectChartList={[{ label: llamma ? `${llamma.collateralSymbol} / crvUSD` : t`Chart` }]}
          setChartTimeOption={setChartTimeOption}
          refetchPricesData={refetchPricesData}
          refetchingHistory={refetchingHistory}
          refetchingCapped={refetchingCapped}
          lastRefetchLength={lastRefetchLength}
          fetchMoreChartData={fetchMoreChartData}
        />
      </Wrapper>
      <LpEventsWrapperExpanded>
        <PoolActivity poolAddress={address} chainId={rChainId} coins={coins} />
      </LpEventsWrapperExpanded>
    </ExpandedWrapper>
  ) : (
    <Wrapper chartExpanded={chartExpanded}>
      <SelectorRow>
        <SelectorButton
          variant={'text'}
          className={poolInfo === 'chart' ? 'active' : ''}
          onClick={() => setPoolInfo('chart')}
        >
          {t`Chart`}
        </SelectorButton>
        <SelectorButton
          variant={'text'}
          className={poolInfo === 'poolActivity' ? 'active' : ''}
          onClick={() => setPoolInfo('poolActivity')}
        >
          {t`LLAMMA Activity`}
        </SelectorButton>
        {isMdUp && (
          <ExpandButton variant={'text'} onClick={() => setChartExpanded()}>
            {chartExpanded ? 'Minimize' : 'Expand'}
            <ExpandIcon name={chartExpanded ? 'Minimize' : 'Maximize'} size={16} aria-label={t`Expand chart`} />
          </ExpandButton>
        )}
      </SelectorRow>
      {poolInfo === 'poolActivity' && <PoolActivity poolAddress={address} chainId={rChainId} coins={coins} />}
      {poolInfo === 'chart' && (
        <ChartWrapper
          chartType="crvusd"
          chartStatus={llamma ? chartFetchStatus : 'LOADING'}
          chartHeight={chartHeight}
          chartExpanded={false}
          themeType={themeType}
          ohlcData={chartOhlcData}
          volumeData={volumeData}
          oraclePriceData={oraclePriceData}
          liquidationRange={selectedLiqRange}
          timeOption={timeOption}
          selectChartList={[{ label: llamma ? `${llamma.collateralSymbol} / crvUSD` : t`Chart` }]}
          setChartTimeOption={setChartTimeOption}
          refetchPricesData={refetchPricesData}
          refetchingHistory={refetchingHistory}
          refetchingCapped={refetchingCapped}
          lastRefetchLength={lastRefetchLength}
          fetchMoreChartData={fetchMoreChartData}
        />
      )}
    </Wrapper>
  )
}

const ExpandedWrapper = styled.div<{ activityHidden: boolean }>`
  display: grid;
  ${(props) =>
    !props.activityHidden
      ? 'grid-template-columns: 2fr 26.4375rem'
      : 'grid-template-columns: auto calc(var(--spacing-3) + var(--spacing-3))'}
`

const LpEventsWrapperExpanded = styled(Box)`
  padding: var(--spacing-3);
  background: var(--box--secondary--content--background-color);
`

const Wrapper = styled(Box)<{ chartExpanded: boolean }>`
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.chartExpanded ? 'var(--spacing-3)' : '0')};
`

const SelectorRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: var(--spacing-2);
`

const SelectorButton = styled(Button)`
  color: inherit;
  font: var(--font);
  font-size: var(--font-size-2);
  font-weight: bold;
  text-transform: none;
  opacity: 0.7;
  &.active {
    opacity: 1;
    border-bottom: 2px solid var(--page--text-color);
  }
`

const ExpandButton = styled(SelectorButton)`
  margin-left: auto;
  display: flex;
  align-content: center;
`

const ExpandIcon = styled(Icon)`
  margin-left: var(--spacing-1);
`

export default PoolInfoData
