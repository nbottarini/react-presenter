// eslint-disable-next-line no-redeclare
import { fireEvent, render, screen } from '@testing-library/react'
import React, { useState } from 'react'
import { ChangeFunc, UnhandledErrorCallback, UnhandledErrorProvider, usePresenter } from '../../src'

it('unhandled error is captured', async () => {
    let capturedError: Error|null = null
    render(<App onUnhandledError={(e) => capturedError = e} />)

    forceUnhandledError()

    await screen.findByText('Unhandled error happened')
    expect(capturedError?.message).toEqual('Forced error')
})

function forceUnhandledError() {
    let button = document.getElementById('force-error')
    fireEvent.click(button)
}

const App: React.FC<Props> = ({ onUnhandledError }) => {
    const [hasUnhandledError, setHasUnhandledError] = useState(false)
    const onError = (e) => {
        onUnhandledError(e)
        setHasUnhandledError(true)
    }
    return (
        <UnhandledErrorProvider onUnhandledError={onError}>
            <ErrorComponent />
            {hasUnhandledError && <span>Unhandled error happened</span>}
        </UnhandledErrorProvider>
    )
}

const ErrorComponent = () => {
    const presenter = usePresenter((onChange) => new ErrorPresenter(onChange))
    return (
        <div>
            <button id="force-error" onClick={() => presenter.forceError()}>Increment</button>
        </div>
    )
}

interface Props {
    onUnhandledError: UnhandledErrorCallback
}

class ErrorPresenter {
    constructor(onChange: ChangeFunc) {}

    async forceError() {
        throw new Error('Forced error')
    }
}
