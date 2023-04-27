import useInstance from '@use-it/instance'
import { DependencyList, useEffect, useReducer } from 'react'
import { ChangeFunc } from './ChangeFunc'

export function usePresenter<TPresenter>(
    presenterFactory: (onChange: ChangeFunc) => TPresenter,
    startArgs: DependencyList = [],
): TPresenter {
    const forceUpdate = useReducer(() => ({}), {})[1] as () => void
    let presenter: TPresenter = useInstance(() => {
        const onModelChange = (_) => forceUpdate()
        return presenterFactory(onModelChange)
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
