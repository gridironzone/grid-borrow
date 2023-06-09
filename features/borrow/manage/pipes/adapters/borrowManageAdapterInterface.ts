import { BigNumber } from 'bignumber.js'
import { IlkData } from 'blockchain/ilks'
import { Context } from 'blockchain/network'
import { Vault } from 'blockchain/vaults'
import {
  ManageVaultChange,
  MutableManageVaultState,
} from 'features/borrow/manage/pipes/manageVault'
import { BalanceInfo } from 'features/shared/balanceInfo'
import { PriceInfo } from 'features/shared/priceInfo'

export type CreateInitialVaultStateArgs<V extends Vault> = {
  vault: V
  priceInfo: PriceInfo
  balanceInfo: BalanceInfo
  ilkData: IlkData
  account?: string
  proxyAddress?: string
  collateralAllowance?: BigNumber
  daiAllowance?: BigNumber
  context: Context
  initialTotalSteps: number
  change: (ch: ManageVaultChange) => void
  injectStateOverride: (stateToOverride: Partial<MutableManageVaultState>) => void
}

export interface BorrowManageAdapterInterface<V extends Vault, ViewState> {
  createInitialViewState(args: CreateInitialVaultStateArgs<V>): ViewState
  transformViewState(viewState: ViewState, change: ManageVaultChange): ViewState
  addTxnCost(viewState: ViewState): ViewState
  addErrorsAndWarnings(viewState: ViewState): ViewState
}
