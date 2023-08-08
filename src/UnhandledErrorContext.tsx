import React, { createContext, FC, ReactNode } from 'react'

export type UnhandledErrorCallback = (error: Error) => void
export const UnhandledErrorContext = createContext<UnhandledErrorCallback>((e) => { console.error(e) })

export const UnhandledErrorProvider: FC<Props> = (props) => {
    return (
        <UnhandledErrorContext.Provider value={props.onUnhandledError}>
            {props.children}
        </UnhandledErrorContext.Provider>
    )
}

interface Props {
    onUnhandledError: UnhandledErrorCallback
    children: ReactNode
}
