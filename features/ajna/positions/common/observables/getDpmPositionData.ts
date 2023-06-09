import { UserDpmAccount } from 'blockchain/userDpmProxies'
import { ethers } from 'ethers'
import { ProxiesRelatedWithPosition } from 'features/aave/helpers/getProxiesRelatedWithPosition'
import { PositionCreated } from 'features/aave/services/readPositionCreatedEvents'
import { PositionId } from 'features/aave/types'
import { isEqual } from 'lodash'
import { combineLatest, EMPTY, Observable, of } from 'rxjs'
import { distinctUntilChanged, map, shareReplay, startWith, switchMap } from 'rxjs/operators'

export interface DpmPositionData extends UserDpmAccount {
  collateralToken: string
  product: string
  protocol: string
  quoteToken: string
}

export function getDpmPositionData$(
  proxiesForPosition$: (positionId: PositionId) => Observable<ProxiesRelatedWithPosition>,
  lastCreatedPositionForProxy$: (proxyAddress: string) => Observable<PositionCreated>,
  positionId: PositionId,
): Observable<DpmPositionData> {
  return proxiesForPosition$(positionId).pipe(
    switchMap(({ dpmProxy }) => {
      return combineLatest(
        of(dpmProxy),
        dpmProxy ? lastCreatedPositionForProxy$(dpmProxy.proxy) : of(undefined),
      )
    }),
    map(([dpmProxy, lastCreatedPosition]) => {
      return dpmProxy && lastCreatedPosition
        ? {
            ...dpmProxy,
            collateralToken: lastCreatedPosition.collateralTokenSymbol,
            product: lastCreatedPosition.positionType.toLowerCase(),
            protocol: lastCreatedPosition.protocol,
            quoteToken: lastCreatedPosition.debtTokenSymbol,
          }
        : null
    }),
    distinctUntilChanged(isEqual),
    shareReplay(1),
  )
}

export function getStaticDpmPositionData$({
  collateralToken,
  product,
  protocol,
  quoteToken,
}: {
  collateralToken: string
  product: string
  protocol: string
  quoteToken: string
}): Observable<DpmPositionData> {
  return EMPTY.pipe(
    startWith({
      collateralToken,
      product,
      protocol,
      proxy: ethers.constants.AddressZero,
      quoteToken,
      user: ethers.constants.AddressZero,
      vaultId: '0',
    }),
  )
}
