[![npm](https://img.shields.io/npm/v/@nbottarini/react-presenter.svg)](https://www.npmjs.com/package/@nbottarini/react-presenter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI Status](https://github.com/nbottarini/react-presenter/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/nbottarini/react-presenter/actions)

# React presenters
Implement [Humble Object Pattern](https://martinfowler.com/bliki/HumbleObject.html) to do sub-cutaneous unit testing without depending on e2e tests or fragile UI tests.

## Installation

Npm:
```
$ npm install --save @nbottarini/react-presenter
```

Yarn:
```
$ yarn add @nbottarini/react-presenter
```

## Introduction

Testing the UI logic is always difficult because of its fragility, indeterminism and slowness. It's a good practice to
implement the [Humble Object Pattern](https://martinfowler.com/bliki/HumbleObject.html) to separate the view logic from the view itself.
The view logic can be encapsulated in a Presenter object that contains all the actions that can be made in the view,
the state that it handles and the logic to operate and transform it.
These Presenter objects are implemented in pure javascript/typescript code without depending on a specific view technology
(like React or Vue).
You can then test the presenter objects using regular unit tests.

In react the view is a React Component and a Presenter is a pure javascript/typescript class where you delegate all
the component logic. The Component is only in charge of aesthetics and choosing the best UI and UX to implement the user
desired actions.
The presenter must be agnostic of which UI component or aesthetic was chosen. This allows the presenters to be independent
from React. This way you can change the UI without breaking the logic, and you can also upgrade or change the UI technology
by keeping the presenters intact.

The presenter exposes the state to the view by using a ViewModel. A ViewModel is simple model that has all the data that
the view should display already formatted and processed. It usually consists of string properties.

The logic is delegated to a presenter class by using the usePresenter hook.
```typescript
usePresenter(presenterFactory, startArgs)
```
This hook receives 2 parameters:
- **presenterFactory:** a function that creates the presenter instance.
  It receives an onChange callback to notify React when the view model has changed.
  The presenter is constructed only once.
- **startArgs:** arguments that are passed to the presenter start method.

A presenter can optionally implement a start method that is called when the view is mounted. It's also called when
the startArgs changes (internally it uses a useEffect so expect the same behaviour).
Another optional method is the stop method. This is called before the view is unmounted or before the startArgs are changed.

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
