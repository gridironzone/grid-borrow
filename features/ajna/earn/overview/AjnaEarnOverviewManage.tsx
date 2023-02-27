import BigNumber from 'bignumber.js'
import { DetailsSection } from 'components/DetailsSection'
import { DetailsSectionContentCardWrapper } from 'components/DetailsSectionContentCard'
import { DetailsSectionFooterItemWrapper } from 'components/DetailsSectionFooterItem'
import { useAjnaGeneralContext } from 'features/ajna/common/contexts/AjnaGeneralContext'
import { useAjnaProductContext } from 'features/ajna/common/contexts/AjnaProductContext'
import { ContentCardCurrentEarnings } from 'features/ajna/earn/overview/ContentCardCurrentEarnings'
import { ContentCardMaxLendingLTV } from 'features/ajna/earn/overview/ContentCardMaxLendingLTV'
import { ContentCardTokensDeposited } from 'features/ajna/earn/overview/ContentCardTokensDeposited'
import { ContentFooterItemsEarnManage } from 'features/ajna/earn/overview/ContentFooterItemsEarnManage'
import { ContentPositionLendingPrice } from 'features/ajna/earn/overview/ContentPositionLendingPrice'
import { useTranslation } from 'next-i18next'
import React from 'react'

export function AjnaEarnOverviewManage() {
  const { t } = useTranslation()
  const {
    environment: { collateralToken, quoteToken, quotePrice },
  } = useAjnaGeneralContext()
  const {
    position: { isSimulationLoading },
  } = useAjnaProductContext('earn')

  return (
    <DetailsSection
      title={t('system.overview')}
      content={
        <DetailsSectionContentCardWrapper>
          <ContentCardCurrentEarnings
            isLoading={isSimulationLoading}
            quoteToken={quoteToken}
            currentEarnings={new BigNumber(0.56)}
            netPnL={new BigNumber(12.35)}
          />
          <ContentCardTokensDeposited
            isLoading={isSimulationLoading}
            quoteToken={quoteToken}
            tokensDeposited={new BigNumber(25)}
            tokensDepositedUSD={new BigNumber(25).times(quotePrice)}
          />
          <ContentCardMaxLendingLTV
            isLoading={isSimulationLoading}
            quoteToken={quoteToken}
            maxLendingPercentage={new BigNumber(65)}
            maxLendingQuote={new BigNumber(120000000)}
          />
          <ContentPositionLendingPrice
            isLoading={isSimulationLoading}
            collateralToken={collateralToken}
            quoteToken={quoteToken}
            positionLendingPrice={new BigNumber(0.332)}
            relationToMarketPrice={new BigNumber(-10)}
          />
        </DetailsSectionContentCardWrapper>
      }
      footer={
        <DetailsSectionFooterItemWrapper>
          <ContentFooterItemsEarnManage
            quoteToken={quoteToken}
            availableToWithdraw={new BigNumber(4.5)}
            earlyWithdrawalPenalty={new BigNumber(2)}
            earlyWithdrawalPeriod={new Date(new Date().getTime() + 10000000)}
          />
        </DetailsSectionFooterItemWrapper>
      }
    />
  )
}