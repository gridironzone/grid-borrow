import BigNumber from 'bignumber.js'
import { CallDef } from 'blockchain/calls/callsHelpers'
import { amountFromWei } from 'blockchain/utils'
import { AaveV3Pool } from 'types/web3-v1-contracts/aave-v3-pool'

export interface AaveV3UserAccountData {
  totalCollateralBase: BigNumber
  totalDebtBase: BigNumber
  availableBorrowsBase: BigNumber
  currentLiquidationThreshold: BigNumber
  ltv: BigNumber
  healthFactor: BigNumber
}

export interface GetEModeCategoryDataParameters {
  categoryId: BigNumber
}

export interface GetEModeCategoryDataResult {
  ltv: BigNumber
  liquidationThreshold: BigNumber
  liquidationBonus: BigNumber
}

export interface AaveV3UserAccountDataParameters {
  address: string
}

export type AaveV3UserConfigurationsParameters = {
  address: string
}
export type AaveV3ConfigurationData = string[]

export const getAaveV3UserAccountData: CallDef<
  AaveV3UserAccountDataParameters,
  AaveV3UserAccountData
> = {
  call: (args, { contract, aaveV3Pool }) => {
    return contract<AaveV3Pool>(aaveV3Pool).methods.getUserAccountData
  },
  prepareArgs: ({ address }) => {
    return [address]
  },
  postprocess: (result) => {
    return {
      totalCollateralBase: amountFromWei(
        new BigNumber(result.totalCollateralBase.toString()),
        'ETH',
      ),
      totalDebtBase: amountFromWei(new BigNumber(result.totalDebtBase.toString()), 'ETH'),
      availableBorrowsBase: amountFromWei(
        new BigNumber(result.availableBorrowsBase.toString()),
        'ETH',
      ),
      currentLiquidationThreshold: new BigNumber(result.currentLiquidationThreshold.toString()),
      ltv: new BigNumber(result.ltv.toString()),
      healthFactor: new BigNumber(result.healthFactor.toString()),
    }
  },
}

export const getAaveV3UserConfiguration: CallDef<
  AaveV3UserConfigurationsParameters,
  AaveV3ConfigurationData
> = {
  call: (args, { contract, aaveV3Pool }) => {
    return contract<AaveV3Pool>(aaveV3Pool).methods.getUserConfiguration
  },
  prepareArgs: ({ address }) => {
    return [address]
  },
}

export const getAaveV3ReservesList: CallDef<void, AaveV3ConfigurationData> = {
  call: (args, { contract, aaveV3Pool }) => {
    return contract<AaveV3Pool>(aaveV3Pool).methods.getReservesList
  },
  prepareArgs: () => {
    return []
  },
}

export const getEModeCategoryData: CallDef<
  GetEModeCategoryDataParameters,
  GetEModeCategoryDataResult
> = {
  call: (args, { contract, aaveV3Pool }) => {
    return contract<AaveV3Pool>(aaveV3Pool).methods.getEModeCategoryData
  },
  prepareArgs: ({ categoryId }) => {
    return [categoryId.toString()]
  },
  postprocess: (result) => {
    return {
      ltv: new BigNumber(result.ltv.toString()).div(10000),
      liquidationThreshold: new BigNumber(result.liquidationThreshold.toString()).div(10000),
      liquidationBonus: new BigNumber(result.liquidationBonus.toString()).minus(10000).div(10000), // 10100 -> 100 -> -> 0.01
    }
  },
}
