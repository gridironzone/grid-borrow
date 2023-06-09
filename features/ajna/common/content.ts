import BigNumber from 'bignumber.js'
import { AjnaPoolData } from 'features/ajna/common/types'

export const productCardsAjna = {
  borrow: [
    {
      token: 'ETH',
      headerKey: 'ajna.product-cards.borrow-against-your',
      icon: 'ether_circle_color',
      background: 'linear-gradient(160.47deg, #F0F3FD 0.35%, #FCF0FD 99.18%), #FFFFFF',
      banner: {
        titleKey: 'ajna.product-cards.collaterals-you-can-borrow',
        collateralsToBorrow: ['USDC', 'DAI', 'stETH', 'wBTC', 'renBTC'],
      },
      button: {
        link: '/',
        labelKey: 'get-started',
      },
      labels: [
        {
          titleKey: 'ajna.product-cards.annual-variable-rates',
          value: '0.25% ↑',
        },
      ],
    },
    {
      token: 'RETH',
      headerKey: 'ajna.product-cards.borrow-against-your',
      icon: 'reth_circle_color',
      background: 'linear-gradient(160.26deg, #FFEAEA 5.25%, #FFF5EA 100%)',
      banner: {
        titleKey: 'ajna.product-cards.collaterals-you-can-borrow',
        collateralsToBorrow: ['USDC', 'DAI', 'stETH', 'wBTC', 'renBTC'],
      },
      button: {
        link: '/',
        labelKey: 'get-started',
      },
      labels: [
        {
          titleKey: 'ajna.product-cards.annual-variable-rates',
          value: '0.25% ↑',
        },
      ],
    },
    {
      token: 'BTC',
      headerKey: 'ajna.product-cards.borrow-against-your',
      icon: 'btc_circle_color',
      background: 'linear-gradient(147.66deg, #FEF1E1 0%, #FDF2CA 88.25%)',
      banner: {
        titleKey: 'ajna.product-cards.collaterals-you-can-borrow',
        collateralsToBorrow: ['USDC', 'DAI', 'stETH', 'wBTC', 'renBTC'],
      },
      button: {
        link: '/',
        labelKey: 'get-started',
      },
      labels: [
        {
          titleKey: 'ajna.product-cards.annual-variable-rates',
          value: '0.25% ↑',
        },
      ],
    },
  ],
}

export const ajnaPoolDummyData: AjnaPoolData = {
  'ETH-USDC': {
    '7DayNetApy': new BigNumber(Math.random() * 10),
    '90DayNetApy': new BigNumber(Math.random() * 10),
    annualFee: new BigNumber(Math.random() * 10),
    liquidityAvaliable: new BigNumber(Math.random() * 10000000),
    maxLtv: new BigNumber(Math.random() * 100),
    maxMultiply: new BigNumber(Math.random() * 10),
    minLtv: new BigNumber(Math.random() * 100),
    minPositionSize: new BigNumber(Math.random() * 1000),
    tvl: new BigNumber(Math.random() * 10000000),
  },
  'WBTC-USDC': {
    '7DayNetApy': new BigNumber(Math.random() * 10),
    '90DayNetApy': new BigNumber(Math.random() * 10),
    annualFee: new BigNumber(Math.random() * 10),
    liquidityAvaliable: new BigNumber(Math.random() * 10000000),
    maxLtv: new BigNumber(Math.random() * 100),
    maxMultiply: new BigNumber(Math.random() * 10),
    minLtv: new BigNumber(Math.random() * 100),
    minPositionSize: new BigNumber(Math.random() * 1000),
    tvl: new BigNumber(Math.random() * 10000000),
  },
}
