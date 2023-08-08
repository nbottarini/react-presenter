// eslint-disable-next-line no-redeclare
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { ChangeFunc, PresenterBase, usePresenter } from '../../src'

it('counter starts at 0', () => {
    render(<Counter />)

    expect(document.getElementById('counter').innerHTML).toEqual('Counter: 0')
})

it('clicking button increments counter to 1', () => {
    render(<Counter />)

    fireEvent.click(screen.getByRole('button'))

    expect(document.getElementById('counter').innerHTML).toEqual('Counter: 1')
})

it('successive clicks to button increments counter by 1', () => {
    render(<Counter />)
    let button = screen.getByRole('button')
    fireEvent.click(button)
    fireEvent.click(button)

    fireEvent.click(button)

    expect(document.getElementById('counter').innerHTML).toEqual('Counter: 3')
})

const Counter: React.FC = () => {
    const presenter = usePresenter((onChange) => new CounterPresenter(onChange))
    return (
        <div>
            <span id="counter">Counter: {presenter.model.value}</span>
            <button onClick={() => presenter.increment()}>Increment</button>
        </div>
    )
}

class CounterPresenter extends PresenterBase<CounterVM> {
    constructor(onChange: ChangeFunc) {
        super(onChange)
        this._model = { value: 0 }
    }

    increment() {
        this.updateModel({ value: this.model.value + 1 })
    }
}

interface CounterVM {
    value: number
}
