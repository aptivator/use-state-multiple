# use-state-multiple

## Table of Contents

* [Introduction](#introduction)
* [Installation](#installation)
  * [Installing the Library](#installing-the-library)
  * [Distributed Versions](#distributed-versions)
* [Usage](#usage)
  * [Invoking the Hook](#invoking-the-hook)
  * [Updating Component State](#updating-component-state)
    * [Multiple Updates](#multiple-updates)
    * [Single Update](#single-update)
  * [Resetting Component State](#resetting-component-state)
  * [Using an Array to Store a State](#using-an-array-to-store-a-state)
* [Development](#development)
  * [Development Setup](#development-setup)
  * [Contributing Changes](#contributing-changes)

## Introduction

`use-state-multiple` provides a mechanism for reading and writing multiple component state
values.  The library's hook replaces multiple `useState()` calls with one and replaces multiple
data setters with also one.

## Installation

### Installing the Library

To fetch the library, run the following command.

```
npm install --save use-state-multiple
```

### Distributed Versions

`use-state-multiple`'s default import is either an EcmaScript (ES) or a CommonJS (as an UMD)
module that bundles the source code without transpilation. The library makes use of nullish
coalescing operator (`??`) and the latest native methods (e.g., Object.hasOwn). The defaults are
provided as such with the expectation that the library will be augmented as a dependency to
a host project that, in turn, will be transpiled for some target environment or used, as is,
in a browser or server-side environment (e.g., Node 20+) that supports the utilized language
features.  For those rare circumstances when `use-state-multiple` has to be utilized in older
browsers, the EcmaScript 5 distributable is available from `use-state-multiple\es5`.

## Usage

### Invoking the Hook

`useStateMultiple()` accepts an initial state (default is a plain object) and returns
an array of current state and state updating and resetting functions.  The current state
can be destructured into individual pieces.

```javascript
import {useStateMultiple} from 'use-state-multiple';

export function Component() {
  let [state, patchState, resetState] = useStateMultiple();
  let {phone = '', username = '', email = ''} = state;

  /*
    ...
  */
}
```

### Updating Component State

#### Multiple Updates

The updating function can take an object of data addresses and their new values.  The
library supports a deeply nested state object and an address can be either a dot-delimited
path (e.g., `user.loggedIn`), an array (e.g., `['user', 'loggedIn']`), or singular
(e.g., `loggedIn`).  A function can be specified instead of a value.  The function will
be given a current state value stored at an address and the function's return will be
then stored at the address.

```javascript
export function Component() {
  let [state, patchState] = useStateMultiple();
  let {count = 0, username = '', email = ''} = state;

  /*
    ...
  */

  patchState({
    count(count = 0) {
      return count + 1;
    },
    email: 'some.email@email.email'
  });
}
```

#### Single Update

For singular updates, the updating function also accepts a data address and its new value.
Instead of a value, a transforming function can be provided that takes an existing value,
operates on it, and returns a new value.

```javascript
export function Component() {
  let [state, patchState] = useStateMultiple();
  let {user: {loggedIn: false, email: ''} = {}, permissions = []} = state;

  /*
    ...
  */

  patchState('user.loggedIn', true);
}
```

#### Updating Process

`patchState()` transforms its input into an array of address and value pairs.  It then
mutates a state one address at a time.  A new value is written only if it is different
from an existing one.  Strict equality (`===`) is used when performing the comparison.

### Resetting Component State

The resetting function can be used to overwrite an entire state at once.  The function's
default parameter is the initial state used with `useStateMultiple()`.  If a different
data state is needed, then it should be passed to the resetter directly.

```javascript
export function Component() {
  let initialState = {loggedIn: true, username: 'username'};
  let [state, patchState, resetState] = useStateMultiple(initialState);

  /*
    ...
  */

  resetState(); // sets state to initialState
}
```

```javascript
export function Component() {
  let initialState = {loggedIn: true, username: 'username'};
  let [state, patchState, resetState] = useStateMultiple(initialState);

  /*
    ...
  */

  resetState({loggedIn: false}); // sets an entirely new state
}
```

### Using an Array to Store a State

An array can be used to hold a state.

```javascript
export function Component() {
  let [state, patchState] = useStateMultiple([]);
  let [loggedIn = false, email = ''] = state;

  /*
    ...
  */

  patchState({0: true, 1: 'email@email.email'});
}
```

## Development

### Development Setup

Perform the following steps to setup the repository locally.

```
git clone https://github.com/aptivator/use-state-multiple.git
cd use-state-multiple
npm install
```

To start development mode run `npm run dev` or `npm run dev:coverage`.

### Contributing Changes

The general recommendations for contributions are to use the latest JavaScript
features, have tests with complete code coverage, and include documentation.
The latter may be necessary only if a new feature is added or an existing documented
feature is modified.
