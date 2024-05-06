import { DependencyList, useContext, useEffect, useReducer } from 'react'
import { ChangeFunc } from './ChangeFunc'
import { UnhandledErrorContext } from './UnhandledErrorContext'
import { unhandledErrorDecorator } from '@nbottarini/unhandled-error-decorator'
import { useInstance } from './useInstance'

type Navigation = EventConsumer & { isFocused: () => boolean }
let useNavigation: () => Navigation | undefined

try {
    const reactNavigationNative = require('@react-navigation/native')
    useNavigation = () => {
        const root = useContext(reactNavigationNative.NavigationContainerRefContext)
        const navigation = useContext(reactNavigationNative.NavigationContext)
        return (navigation ?? root) as Navigation
    }
} catch (e) {
    useNavigation = () => undefined
}

export type EventConsumer = {
    addListener(type: string, callback: Function): () => void
    removeListener(type: string, callback: Function): void
}

export function usePresenter<TPresenter>(
    presenterFactory: (onChange: ChangeFunc) => TPresenter,
    startArgs: DependencyList = [],
): TPresenter {
    const onUnhandledError = useContext(UnhandledErrorContext)
    const forceUpdate = useReducer(() => ({}), {})[1] as () => void
    let presenter: TPresenter = useInstance(() => {
        const onModelChange = (_) => forceUpdate()
        return unhandledErrorDecorator(presenterFactory(onModelChange), onUnhandledError)
    })
    const navigation = useNavigation()
    useEffect(() => {
        let isFocused = navigation?.isFocused?.() ?? false
        const unsubscribeFocus = navigation?.addListener('focus', () => {
            if (isFocused) return
            // @ts-ignore
            presenter.resume?.(...startArgs)
            isFocused = true
        })
        const unsubscribeBlur = navigation?.addListener('blur', () => {
            // @ts-ignore
            presenter.pause?.()
            isFocused = false
        })

        // @ts-ignore
        presenter.start?.(...startArgs)
        return () => {
            // @ts-ignore
            presenter.stop?.()

            unsubscribeFocus?.()
            unsubscribeBlur?.()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, startArgs)
    return presenter
}
