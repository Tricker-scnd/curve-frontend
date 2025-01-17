import type { FormDetailInfo, FormDetailInfoSharedProps } from '@/components/PageLoanCreate/types'

import { t } from '@lingui/macro'
import styled from 'styled-components'
import React from 'react'

import { DEFAULT_DETAIL_INFO_LEVERAGE } from '@/components/PageLoanCreate/utils'
import { getTokenName } from '@/utils/utilsLoan'
import { formatNumber } from '@/ui/utils'
import useStore from '@/store/useStore'

import DetailInfo from '@/ui/DetailInfo'
import DetailInfoBorrowRate from '@/components/DetailInfoBorrowRate'
import DetailInfoEstGas from '@/components/DetailInfoEstimateGas'
import DetailInfoHealth from '@/components/DetailInfoHealth'
import DetailInfoLiqRange from '@/components/DetailInfoLiqRange'
import DetailInfoLiqRangeEdit from '@/components/DetailInfoLiqRangeEdit'
import DetailInfoN from '@/components/DetailInfoN'
import DetailInfoSlippageTolerance from '@/components/DetailInfoSlippageTolerance'
import DetailInfoTradeRoutes from '@/components/PageLoanCreate/LoanFormCreate/components/DetailInfoTradeRoutes'
import { useUserProfileStore } from '@ui-kit/features/user-profile'

const DetailInfoLeverage = ({
  activeKey,
  activeKeyLiqRange,
  activeStep,
  chainId,
  detailInfoLTV,
  formEstGas,
  isAdvanceMode,
  isReady,
  isValidFormValues = true,
  haveSigner,
  healthMode,
  llamma,
  llammaId,
  steps,
  handleSelLiqRange,
  selectedLiqRange,
  setHealthMode,
  handleLiqRangesEdit,
}: FormDetailInfo & FormDetailInfoSharedProps) => {
  const detailInfo = useStore((state) => state.loanCreate.detailInfoLeverage[activeKey] ?? DEFAULT_DETAIL_INFO_LEVERAGE)
  const formValues = useStore((state) => state.loanCreate.formValues)
  const isEditLiqRange = useStore((state) => state.loanCreate.isEditLiqRange)
  const liqRanges = useStore((state) => state.loanCreate.liqRanges[activeKeyLiqRange])
  const loanDetails = useStore((state) => state.loans.detailsMapper[llammaId])
  const userLoanDetails = useStore((state) => state.loans.userDetailsMapper[llammaId])

  const maxSlippage = useUserProfileStore((state) => state.maxSlippage.global)

  const LeverageDetail = () => (
    <DetailInfo label={t`Leverage:`} loading={!isReady || detailInfo.loading} loadingSkeleton={[50, 20]}>
      {isValidFormValues && detailInfo.leverage ? (
        <strong>{formatNumber(detailInfo.leverage, { maximumFractionDigits: 2 })}x</strong>
      ) : (
        '-'
      )}
    </DetailInfo>
  )

  const LeveragePriceImpactDetail = () => (
    <DetailInfo
      isBold={isValidFormValues && detailInfo.isHighImpact}
      variant={isValidFormValues && detailInfo.isHighImpact ? 'error' : undefined}
      label={isValidFormValues && detailInfo.isHighImpact ? t`High price impact:` : t`Price impact:`}
      loading={!isReady || detailInfo.loading}
      loadingSkeleton={[70, 20]}
    >
      {isValidFormValues && detailInfo.priceImpact ? (
        <strong>{formatNumber(detailInfo.priceImpact, { style: 'percent', maximumFractionDigits: 4 })}</strong>
      ) : (
        '-'
      )}
    </DetailInfo>
  )

  const advanceModeLeverageDetail = (
    <DetailInfoLeverageWrapper>
      <LeverageDetail />
      <LeveragePriceImpactDetail />
      <DetailInfoTradeRoutes
        isValidFormValues={isValidFormValues}
        loading={!isReady || detailInfo.loading}
        routes={detailInfo.routeName}
        input={formValues.debt}
        inputSymbol={getTokenName(llamma).stablecoin}
        output={
          !!detailInfo.collateral && !!formValues.collateral ? +detailInfo.collateral - +formValues.collateral : ''
        }
        outputSymbol={llamma?.collateralSymbol ?? ''}
      />
    </DetailInfoLeverageWrapper>
  )

  return (
    <div>
      {isAdvanceMode ? (
        <>
          <DetailInfoLiqRange
            {...detailInfo}
            detailInfoLeverage={advanceModeLeverageDetail}
            healthMode={haveSigner ? healthMode : null}
            isEditLiqRange={isEditLiqRange}
            isValidFormValues={isValidFormValues}
            loading={detailInfo.loading}
            loanDetails={loanDetails}
            selectedLiqRange={selectedLiqRange}
            userLoanDetails={userLoanDetails}
            handleLiqRangesEdit={handleLiqRangesEdit}
          />

          <DetailInfoN isReady={isReady} n={formValues.n} />
          <DetailInfoLiqRangeEdit
            {...detailInfo}
            liqRanges={liqRanges}
            maxBands={llamma?.maxBands}
            minBands={llamma?.minBands}
            selectedLiqRange={selectedLiqRange}
            showEditLiqRange={isEditLiqRange}
            handleSelLiqRange={handleSelLiqRange}
          />
        </>
      ) : (
        <>
          <LeverageDetail />
          <LeveragePriceImpactDetail />
        </>
      )}
      {haveSigner && (
        <DetailInfoHealth
          {...detailInfo}
          isManage={false}
          amount={formValues.debt}
          formType="create-loan"
          healthMode={healthMode}
          isValidFormValues={isValidFormValues}
          loanDetails={loanDetails}
          setHealthMode={setHealthMode}
          userLoanDetails={userLoanDetails}
        />
      )}
      <DetailInfoBorrowRate parameters={loanDetails?.parameters} />
      {isAdvanceMode && detailInfoLTV}
      <DetailInfoSlippageTolerance maxSlippage={maxSlippage} />
      <DetailInfo
        isDivider
        label={t`Total position collateral:`}
        loading={!isReady || detailInfo.loading}
        loadingSkeleton={[90, 20]}
      >
        {isValidFormValues && detailInfo.collateral ? (
          <strong>
            {formatNumber(detailInfo.collateral)} {llamma?.collateralSymbol}
          </strong>
        ) : (
          '-'
        )}
      </DetailInfo>
      {haveSigner && chainId && (
        <DetailInfoEstGas
          chainId={chainId}
          {...formEstGas}
          stepProgress={activeStep && steps.length > 1 ? { active: activeStep, total: steps.length } : null}
        />
      )}
    </div>
  )
}

const DetailInfoLeverageWrapper = styled.div`
  border: 1px solid var(--border-400);
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
`

export default DetailInfoLeverage
