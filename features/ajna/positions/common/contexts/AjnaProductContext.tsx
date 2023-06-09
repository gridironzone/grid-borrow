import { AjnaEarnPosition, AjnaPosition } from '@oasisdex/oasis-actions-poc'
import { AjnaSimulationData } from 'actions/ajna'
import { useAppContext } from 'components/AppContextProvider'
import { DetailsSectionNotificationItem } from 'components/DetailsSectionNotification'
import { useGasEstimationContext } from 'components/GasEstimationContextProvider'
import { ValidationMessagesInput } from 'components/ValidationMessages'
import { AjnaProduct } from 'features/ajna/common/types'
import {
  AjnaBorrowFormState,
  useAjnaBorrowFormReducto,
} from 'features/ajna/positions/borrow/state/ajnaBorrowFormReducto'
import { useAjnaGeneralContext } from 'features/ajna/positions/common/contexts/AjnaGeneralContext'
import { getAjnaNotifications } from 'features/ajna/positions/common/notifications'
import { getAjnaValidation } from 'features/ajna/positions/common/validation'
import {
  AjnaEarnFormState,
  useAjnaEarnFormReducto,
} from 'features/ajna/positions/earn/state/ajnaEarnFormReducto'
import { useObservable } from 'helpers/observableHook'
import { useAccount } from 'helpers/useAccount'
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface AjnaProductContextProviderPropsWithBorrow {
  formReducto: typeof useAjnaBorrowFormReducto
  formDefaults: Partial<AjnaBorrowFormState>
  position: AjnaPosition
  product: 'borrow'
}
interface AjnaProductContextProviderPropsWithEarn {
  formReducto: typeof useAjnaEarnFormReducto
  formDefaults: Partial<AjnaEarnFormState>
  position: AjnaEarnPosition
  product: 'earn'
}
interface AjnaProductContextProviderPropsWithMultiply {
  // TODO: to be replaced with useAjnaMultiplyFormReducto when availavble
  formReducto: typeof useAjnaBorrowFormReducto
  formDefaults: Partial<AjnaBorrowFormState>
  position: AjnaPosition
  product: 'multiply'
}
type AjnaProductDetailsContextProviderProps =
  | AjnaProductContextProviderPropsWithBorrow
  | AjnaProductContextProviderPropsWithEarn
  | AjnaProductContextProviderPropsWithMultiply

interface AjnaPositionSet<P> {
  position: P
  simulation?: P
}

interface AjnaProductContextPosition<P> {
  cachedPosition?: AjnaPositionSet<P>
  currentPosition: AjnaPositionSet<P>
  isSimulationLoading?: boolean
  resolvedId?: string
  setCachedPosition: (positionSet: AjnaPositionSet<AjnaPosition | AjnaEarnPosition>) => void
  setIsLoadingSimulation: Dispatch<SetStateAction<boolean>>
  setSimulation: Dispatch<
    SetStateAction<AjnaSimulationData<AjnaPosition | AjnaEarnPosition> | undefined>
  >
}

interface AjnaProductContext<P, F> {
  form: F
  position: AjnaProductContextPosition<P>
  validation: {
    errors: ValidationMessagesInput
    isFormValid: boolean
    warnings: ValidationMessagesInput
  }
  notifications: DetailsSectionNotificationItem[]
}

type AjnaProductContextWithBorrow = AjnaProductContext<
  AjnaPosition,
  ReturnType<typeof useAjnaBorrowFormReducto>
>
type AjnaProductContextWithEarn = AjnaProductContext<
  AjnaEarnPosition,
  ReturnType<typeof useAjnaEarnFormReducto>
>

const ajnaBorrowContext = React.createContext<AjnaProductContextWithBorrow | undefined>(undefined)
const ajnaEarnContext = React.createContext<AjnaProductContextWithEarn | undefined>(undefined)

type PickProductType<T extends AjnaProduct> = T extends 'borrow'
  ? AjnaProductContextWithBorrow
  : T extends 'earn'
  ? AjnaProductContextWithEarn // TODO: Add AjnaProductContextWithMultiply
  : never

export function useAjnaProductContext<T extends AjnaProduct>(product: T): PickProductType<T> {
  const { environment } = useAjnaGeneralContext()
  const context = product === 'borrow' ? useContext(ajnaBorrowContext) : useContext(ajnaEarnContext)

  if (product !== environment.product)
    throw new Error(
      `AjnaGeneralContext and AjnaProductContext products doesn't match: ${environment.product}/${product}`,
    )
  if (!context) throw new Error('AjnaProductContext not available!')
  return context as PickProductType<T>
}

export function AjnaProductContextProvider({
  children,
  formDefaults,
  formReducto,
  product,
  position,
}: PropsWithChildren<AjnaProductDetailsContextProviderProps>) {
  const { walletAddress } = useAccount()
  const gasEstimation = useGasEstimationContext()
  const { positionIdFromDpmProxy$ } = useAppContext()

  const {
    environment: {
      collateralBalance,
      collateralToken,
      quoteToken,
      ethBalance,
      ethPrice,
      quoteBalance,
    },
    steps: { currentStep },
    tx: { txDetails },
  } = useAjnaGeneralContext()
  // TODO: find a way to distinguish between the types - there no place for error here except for typescript is too stupid to understand
  // @ts-expect-error
  const form = formReducto(formDefaults)
  const { state } = form

  const [positionIdFromDpmProxyData] = useObservable(
    useMemo(() => positionIdFromDpmProxy$(state.dpmAddress), [state.dpmAddress]),
  )

  const [cachedPosition, setCachedPosition] = useState<AjnaPositionSet<typeof position>>()
  const [simulation, setSimulation] = useState<AjnaSimulationData<typeof position>>()
  const [isSimulationLoading, setIsLoadingSimulation] = useState(false)

  const validation = useMemo(
    () =>
      getAjnaValidation({
        collateralBalance,
        collateralToken,
        currentStep,
        ethBalance,
        ethPrice,
        gasEstimationUsd: gasEstimation?.usdValue,
        product,
        quoteBalance,
        simulationErrors: simulation?.errors,
        simulationWarnings: simulation?.warnings,
        state,
        position,
        txError: txDetails?.txError,
      }),
    [
      currentStep,
      collateralBalance.toNumber(),
      collateralToken,
      ethBalance.toNumber(),
      ethPrice.toNumber(),
      gasEstimation?.usdValue.toNumber(),
      quoteBalance.toNumber(),
      simulation?.errors,
      state,
      txDetails?.txError,
    ],
  )

  const notifications = useMemo(
    () =>
      getAjnaNotifications({
        position,
        product,
        quoteToken,
        collateralToken,
        dispatch: form.dispatch,
        updateState: form.updateState,
      }),
    [quoteToken, collateralToken, position],
  )

  const [context, setContext] = useState<AjnaProductContext<typeof position, typeof form>>({
    form,
    position: {
      cachedPosition,
      currentPosition: { position },
      isSimulationLoading,
      resolvedId: positionIdFromDpmProxyData,
      setCachedPosition: (positionSet) => setCachedPosition(positionSet),
      setIsLoadingSimulation,
      setSimulation,
    },
    validation,
    notifications,
  })

  useEffect(() => {
    setContext((prev) => ({
      ...prev,
      form,
      position: {
        ...prev.position,
        cachedPosition,
        currentPosition: {
          position,
          simulation: simulation?.position,
        },
        isSimulationLoading,
        resolvedId: positionIdFromDpmProxyData,
      },
      validation,
      notifications,
    }))
  }, [
    cachedPosition,
    collateralBalance,
    currentStep,
    ethBalance,
    ethPrice,
    state,
    isSimulationLoading,
    position,
    positionIdFromDpmProxyData,
    quoteBalance,
    simulation,
    txDetails,
    validation,
    notifications,
    walletAddress,
  ])

  switch (product) {
    case 'borrow':
      return (
        <ajnaBorrowContext.Provider value={context as AjnaProductContextWithBorrow}>
          {children}
        </ajnaBorrowContext.Provider>
      )
    case 'earn':
      return (
        <ajnaEarnContext.Provider value={context as AjnaProductContextWithEarn}>
          {children}
        </ajnaEarnContext.Provider>
      )
    case 'multiply':
      return <></>
  }
}
