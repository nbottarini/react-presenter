// eslint-disable-next-line no-redeclare
import { fireEvent, render } from '@testing-library/react'
import React, { useState } from 'react'
import { ChangeFunc, usePresenter } from '../../src'

it('create is called on creation', () => {
    let createCalled = 0

    render(<LifecycleComponent onCreate={() => createCalled++} onInit={() => {}} onStart={() => {}} onStop={() => {}} />)

    expect(createCalled).toEqual(1)
})

it('create is not called on rerender', () => {
    let createCalled = 0
    render(<LifecycleComponent onCreate={() => createCalled++} onInit={() => {}} onStart={() => {}} onStop={() => {}} />)

    forceRerender()

    expect(createCalled).toEqual(1)
})

it('init is called on creation', () => {
    let initCalled = 0

    render(<LifecycleComponent onCreate={() => {}} onInit={() => initCalled++} onStart={() => {}} onStop={() => {}} />)

    expect(initCalled).toEqual(1)
})

it('init is not called on rerender', () => {
    let initCalled = 0
    render(<LifecycleComponent onCreate={() => {}} onInit={() => initCalled++} onStart={() => {}} onStop={() => {}} />)

    forceRerender()

    expect(initCalled).toEqual(1)
})

it('start is called on first mount', () => {
    let startCalled = 0

    render(<LifecycleComponent onCreate={() => {}} onInit={() => {}} onStart={() => startCalled++} onStop={() => {}} />)

    expect(startCalled).toEqual(1)
})

it('start is not called on rerender', () => {
    let startCalled = 0
    render(<LifecycleComponent onCreate={() => {}} onInit={() => {}} onStart={() => startCalled++} onStop={() => {}} />)

    forceRerender()

    expect(startCalled).toEqual(1)
})

it('start is called with start params', () => {
    let receivedStartParams = []

    render(<LifecycleComponent onCreate={() => {}} onInit={() => {}} onStart={(params) => receivedStartParams = params} onStop={() => {}} />)

    expect(receivedStartParams).toEqual([false, 'hello'])
})

it('start is called when start param1 change', () => {
    let startCalled = 0
    let receivedStartParams = []
    const onStart = (params) => {
        startCalled++
        receivedStartParams.push(params)
    }
    render(<LifecycleComponent onCreate={() => {}} onInit={() => {}} onStart={onStart} onStop={() => {}} />)

    forceParamChange('param1')

    expect(startCalled).toEqual(2)
    expect(receivedStartParams).toEqual([[false, 'hello'], [true, 'hello']])
})

it('start is called when start param2 change', () => {
    let startCalled = 0
    let receivedStartParams = []
    const onStart = (params) => {
        startCalled++
        receivedStartParams.push(params)
    }
    render(<LifecycleComponent onCreate={() => {}} onInit={() => {}} onStart={onStart} onStop={() => {}} />)

    forceParamChange('param2')

    expect(startCalled).toEqual(2)
    expect(receivedStartParams).toEqual([[false, 'hello'], [false, 'world']])
})

it('stop is not called on render', () => {
    let stopCalled = 0

    render(<LifecycleComponent onCreate={() => {}} onInit={() => {}} onStart={() => {}} onStop={() => stopCalled++} />)

    expect(stopCalled).toEqual(0)
})

it('stop is called on unmount', () => {
    let stopCalled = 0
    const { unmount } = render(<LifecycleComponent onCreate={() => {}} onInit={() => {}} onStart={() => {}} onStop={() => stopCalled++} />)

    unmount()

    expect(stopCalled).toEqual(1)
})

it('stop is called when start params changes', () => {
    let log = []
    render(<LifecycleComponent onCreate={() => {}} onInit={() => {}} onStart={() => log.push('start')} onStop={() => log.push('stop')} />)

    forceParamChange('param1')

    expect(log).toEqual(['start', 'stop', 'start'])
})

function forceRerender() {
    let button = document.getElementById('increment')
    fireEvent.click(button)
}

function forceParamChange(name) {
    let button = document.getElementById('change-' + name)
    fireEvent.click(button)
}

const LifecycleComponent: React.FC<Props> = ({ onCreate, onInit, onStart, onStop }) => {
    const [counter, setCounter] = useState(0)
    const [param1, setParam1] = useState(false)
    const [param2, setParam2] = useState('hello')
    usePresenter((onChange) => new LifecyclePresenter(onChange, onCreate, onInit, onStart, onStop), [param1, param2])
    return (
        <div>
            <div>Counter: {counter}</div>
            <button id="increment" onClick={() => setCounter(counter + 1)}>Increment</button>
            <button id="change-param1" onClick={() => setParam1(true)}>Change Param1</button>
            <button id="change-param2" onClick={() => setParam2('world')}>Change Param2</button>
        </div>
    )
}

interface Props {
    onCreate: () => void
    onInit: (...params: any[]) => void
    onStart: (...params: any[]) => void
    onStop: () => void
}

class LifecyclePresenter {
    constructor(
        onChange: ChangeFunc,
        private onCreate: () => void,
        private onInit: (params: any) => void,
        private onStart: (params: any) => void,
        private onStop: () => void
    ) {
        this.onCreate()
    }

    init(param1, param2) {
        this.onInit([param1, param2])
    }

    start(param1, param2) {
        this.onStart([param1, param2])
    }

    stop() {
        this.onStop()
    }
}
