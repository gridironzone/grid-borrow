import { AjnaFlow, AjnaFormState } from 'features/ajna/common/types'
import { UseFlowStateProps } from 'helpers/useFlowState'
import { zero } from 'helpers/zero'

interface GetFlowStateConfigParams {
  collateralToken: string
  quoteToken: string
  state: AjnaFormState
  flow: AjnaFlow
}

export function getFlowStateConfig({
  collateralToken,
  quoteToken,
  state,
  flow,
}: GetFlowStateConfigParams): {
  amount: UseFlowStateProps['amount']
  token: UseFlowStateProps['token']
} {
  const { action } = state

  switch (action) {
    case 'open-earn':
    case 'deposit-earn':
      // THIS CONDITION IS ADDED TO BYPASS DPM & ALLOWANCE FLOW
      // WHILE IN AJNA EARN ADJUST MANAGE VIEW
      if (state.uiDropdown === 'adjust' && flow === 'manage') {
        return {
          amount: zero,
          token: 'ETH',
        }
      }
      return {
        amount: state.depositAmount,
        token: quoteToken,
      }
    case 'withdraw-earn':
      return {
        amount: zero,
        token: 'ETH',
      }
    case 'open-borrow':
    case 'deposit-borrow':
      return {
        amount: state.depositAmount,
        token: collateralToken,
      }
    case 'payback-borrow':
      return {
        amount: state.paybackAmount,
        token: quoteToken,
      }
    default:
      return {
        amount: zero,
        token: collateralToken,
      }
  }
}
