[![npm](https://img.shields.io/npm/v/@nbottarini/react-presenter.svg)](https://www.npmjs.com/package/@nbottarini/react-presenter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI Status](https://github.com/nbottarini/react-presenter/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/nbottarini/react-presenter/actions)

# React presenters
Implement Humble Object Pattern to do sub-cutaneous unit testing without depending on e2e tests or fragile UI tests.

## Installation

Npm:
```
$ npm install --save @nbottarini/react-presenter
```

Yarn:
```
$ yarn add @nbottarini/react-presenter
```

## Basic Usage

**Counter.tsx:**

```typescript jsx
import React from 'react'
import { usePresenter } from '@nbottarini/react-presenter'

const useCounterPresenter = () => usePresenter((onChange) => new CounterPresenter(onChange))

export const Counter: React.FC = () => {
    const presenter = useCounterPresenter()
    return (
        <div>
            <span id="counter">Counter: {presenter.model.value}</span>
            <button onClick={() => presenter.increment()}>Increment</button>
        </div>
    )
}
```

**CounterPresenter.ts:**
```typescript
import { PresenterBase, ChangeFunc } from '@nbottarini/react-presenter'

export class CounterPresenter extends PresenterBase<CounterVM> {
    constructor(onChange: ChangeFunc) {
        super(onChange)
        this._model = { value: 0 }
    }

    increment() {
        this.updateModel({ value: this.model.value + 1 })
    }
}

export interface CounterVM {
    value: number
}
```

**CounterPresenter.test.ts:**
```typescript
it('starts with 0', () => {
    const presenter = new CounterPresenter(onChange)
    
    expect(presenter.model.value).toEqual(0)
})

it('increment increments value by 1', () => {
    const presenter = new CounterPresenter(onChange)
    presenter.increment()
    
    presenter.increment()

    expect(presenter.model.value).toEqual(2)
})

const onChange = () => {}
```
