import useInstance from '@use-it/instance'
import { DependencyList, useContext, useEffect, useReducer } from 'react'
import { ChangeFunc } from './ChangeFunc'
import { UnhandledErrorContext } from './UnhandledErrorContext'
import { unhandledErrorDecorator } from '@nbottarini/unhandled-error-decorator'

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
    useEffect(() => {
        // @ts-ignore
        presenter.start?.(...startArgs)
        return () => {
            // @ts-ignore
            presenter.stop?.()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, startArgs)
    return presenter
}
