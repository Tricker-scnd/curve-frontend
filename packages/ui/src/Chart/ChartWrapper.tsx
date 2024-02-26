import type {
  TimeOptions,
  LpPriceOhlcDataFormatted,
  LabelList,
  LlammaLiquididationRange,
  ChartType,
  FetchingStatus,
  ChartHeight,
  VolumeData,
  OraclePriceData,
} from './types'

import { useState, useRef } from 'react'
import styled from 'styled-components'
import { cloneDeep } from 'lodash'

import DateRangePicker from 'ui/src/DateRangePicker'
import Button from 'ui/src/Button/Button'
import Icon from 'ui/src/Icon'
import Spinner, { SpinnerWrapper } from 'ui/src/Spinner'
import CandleChart from 'ui/src/Chart/CandleChart'
import DialogSelectChart from 'ui/src/Chart/DialogSelectChart'
import DialogSelectTimeOption from 'ui/src/Chart/DialogSelectTimeOption'
import Box from 'ui/src/Box'

type Props = {
  chartType: ChartType
  chartHeight: ChartHeight
  chartStatus: FetchingStatus
  chartExpanded: boolean
  themeType: string
  ohlcData: LpPriceOhlcDataFormatted[]
  volumeData?: VolumeData[]
  oraclePriceData?: OraclePriceData[]
  liquidationRange?: LlammaLiquididationRange
  selectedChartIndex?: number
  setChartSelectedIndex?: (index: number) => void
  timeOption: TimeOptions
  setChartTimeOption: (option: TimeOptions) => void
  flipChart?: () => void
  refetchPricesData: () => void
  fetchMoreChartData: () => void
  refetchingHistory: boolean
  refetchingCapped: boolean
  lastRefetchLength: number
  selectChartList?: LabelList[]
}

const ChartWrapper = ({
  chartType,
  chartStatus,
  chartHeight,
  chartExpanded,
  themeType,
  ohlcData,
  volumeData,
  oraclePriceData,
  liquidationRange,
  selectedChartIndex,
  setChartSelectedIndex,
  timeOption,
  setChartTimeOption,
  flipChart,
  refetchPricesData,
  fetchMoreChartData,
  refetchingHistory,
  refetchingCapped,
  lastRefetchLength,
  selectChartList,
}: Props) => {
  const [magnet, setMagnet] = useState(false)
  const clonedOhlcData = cloneDeep(ohlcData)

  const wrapperRef = useRef(null)

  return (
    <Wrapper>
      <ContentWrapper>
        <SectionHeader>
          <ChartSelectGroup>
            {selectedChartIndex !== undefined && setChartSelectedIndex !== undefined && flipChart !== undefined ? (
              <>
                <DialogSelectChart
                  isDisabled={chartStatus !== 'READY'}
                  selectedChartIndex={selectedChartIndex}
                  selectChartList={selectChartList ?? []}
                  setChartSelectedIndex={setChartSelectedIndex}
                />
                {selectedChartIndex > 1 && (
                  <StyledFlipButton onClick={() => flipChart()} variant={'icon-outlined'}>
                    <StyledFLipIcon name={'ArrowsHorizontal'} size={16} aria-label={'Flip tokens'} />
                  </StyledFlipButton>
                )}
              </>
            ) : (
              <DialogSelectChart
                isDisabled={false}
                selectedChartIndex={0}
                selectChartList={selectChartList ?? []}
                setChartSelectedIndex={() => 0}
              />
            )}
          </ChartSelectGroup>
          <RefreshButton
            size="small"
            variant="select"
            onClick={() => {
              refetchPricesData()
            }}
          >
            <Icon name={'Renew'} size={16} aria-label={'Toggle magnet mode'} />
          </RefreshButton>
          <MagnetButton
            size="small"
            variant="select"
            className={magnet ? 'active' : ''}
            onClick={() => setMagnet(!magnet)}
          >
            <Icon name={'Cursor_1'} size={16} aria-label={'Toggle magnet mode'} />
          </MagnetButton>
          <DialogSelectTimeOption
            isDisabled={chartStatus !== 'READY'}
            currentTimeOption={timeOption}
            setCurrentTimeOption={setChartTimeOption}
          />
        </SectionHeader>
        {chartType === 'crvusd' && chartStatus === 'READY' && (
          <TipWrapper>
            <TipContent>
              <TipIcon name="StopFilledAlt" size={20} fill="var(--chart-oracle-price-line)" />
              Oracle Price
            </TipContent>
            {liquidationRange !== undefined && liquidationRange.price1.length !== 0 && (
              <TipContent>
                <TipIcon name="StopFilledAlt" size={20} fill="var(--warning-400)" />
                <TipText>Liquidation Range</TipText>
              </TipContent>
            )}
          </TipWrapper>
        )}
        {chartStatus === 'READY' && (
          <ResponsiveContainer ref={wrapperRef} chartExpanded={chartExpanded} chartHeight={chartHeight}>
            <CandleChart
              chartType={chartType}
              chartHeight={chartHeight}
              ohlcData={clonedOhlcData}
              volumeData={volumeData}
              oraclePriceData={oraclePriceData}
              liquidationRange={liquidationRange}
              timeOption={timeOption}
              wrapperRef={wrapperRef}
              chartExpanded={chartExpanded}
              magnet={magnet}
              themeType={themeType}
              refetchingHistory={refetchingHistory}
              refetchingCapped={refetchingCapped}
              lastRefetchLength={lastRefetchLength}
              fetchMoreChartData={fetchMoreChartData}
            />
          </ResponsiveContainer>
        )}
        {chartStatus === 'LOADING' && (
          <StyledSpinnerWrapper
            minHeight={chartExpanded ? chartHeight.expanded.toString() + 'px' : chartHeight.standard.toString() + 'px'}
          >
            <Spinner size={18} />
          </StyledSpinnerWrapper>
        )}
        {chartStatus === 'ERROR' && (
          <StyledSpinnerWrapper
            minHeight={chartExpanded ? chartHeight.expanded.toString() + 'px' : chartHeight.standard.toString() + 'px'}
          >
            <ErrorMessage>{'There was an error fetching the Chart data.'}</ErrorMessage>
          </StyledSpinnerWrapper>
        )}
      </ContentWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledFlipButton = styled(Button)`
  margin: auto var(--spacing-3) auto 0;
`

const StyledFLipIcon = styled(Icon)``

const SectionHeader = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: var(--spacing-3);
  padding-right: var(--spacing-2);
`

const ChartSelectGroup = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: auto;
`

const MagnetButton = styled(Button)`
  margin-left: var(--spacing-2);
  margin-right: var(--spacing-2);
  box-shadow: none;
  display: flex;
  display: none;
  align-items: center;
  &.active:not(:disabled) {
    box-shadow: none;
  }
  @media (min-width: 31.25rem) {
    display: flex;
  }
`

const RefreshButton = styled(Button)`
  margin-left: var(--spacing-2);
  box-shadow: none;
  display: flex;
  display: none;
  align-items: center;
  &.active:not(:disabled) {
    box-shadow: none;
  }
  @media (min-width: 31.25rem) {
    display: flex;
  }
`

const ResponsiveContainer = styled.div<{ chartExpanded: boolean; chartHeight: ChartHeight }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  min-height: ${(props) =>
    props.chartExpanded ? props.chartHeight.expanded.toString() + 'px' : props.chartHeight.standard.toString() + 'px'};
  padding-bottom: var(--spacing-3);
`

const StyledDateRangePicker = styled(DateRangePicker)`
  /* margin-top: 500px; */
  margin: auto auto 0;
`

const StyledSpinnerWrapper = styled(SpinnerWrapper)`
  /* margin: var(--spacing-3) 0 var(--spacing-3); */
`

const ErrorMessage = styled.p`
  font-size: var(--font-size-2);
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const TipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: var(--spacing-2);
`

const TipContent = styled(Box)`
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: var(--font-size-1);
  font-weight: var(--font-weight);
`

const TipIcon = styled(Icon)`
  position: relative;
  left: -2px;
`

const TipText = styled.p`
  font-size: var(--font-size-1);
`

export default ChartWrapper
