import InputProvider, { InputDebounced } from '@ui/InputComp'
import { t } from '@ui-kit/lib/i18n'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import type { Address } from 'viem'
import type { AddRewardFormValues } from '@/dex/features/add-gauge-reward-token/types'
import { FlexItemDistributor, SubTitle } from './styled'

export const DistributorInput: React.FC<{ disabled: boolean }> = ({ disabled }) => {
  const { setValue, formState, trigger, watch } = useFormContext<AddRewardFormValues>()
  const distributorId = watch('distributorId')

  return (
    <FlexItemDistributor>
      <SubTitle>{t`Distributor`}</SubTitle>
      <InputProvider
        grid
        gridTemplateColumns="1fr auto"
        id="distributor"
        inputVariant={formState.errors.distributorId ? 'error' : undefined}
        padding="var(--spacing-1) var(--spacing-1)"
      >
        <InputDebounced
          value={distributorId ?? ''}
          labelProps={false}
          id="inpDistributor"
          type="text"
          onChange={(value) => setValue('distributorId', value as Address, { shouldValidate: true })}
          onBlur={() => trigger('distributorId')}
          disabled={disabled}
        />
      </InputProvider>
    </FlexItemDistributor>
  )
}
