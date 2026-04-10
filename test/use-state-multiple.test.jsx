import {expect}           from 'chai';
import React              from 'react';
import {act}              from 'react';
import {createRoot}       from 'react-dom/client';
import {useStateMultiple} from '../src/use-state-multiple';
import {rootContainer}    from './_lib/test-dom';

global.IS_REACT_ACT_ENVIRONMENT = true

describe(`use-state-multiple`, () => {
  let root = createRoot(rootContainer);
  let renderCount = 0;
  let state;
  let patchState;
  let resetState;

  function renderComponent(initialState) {
    function Component() {
      [state, patchState, resetState] = useStateMultiple(initialState);
      renderCount++;
    }

    act(() => root.render(<Component />));
  }

  afterEach(() => renderCount = 0);

  it('returns current state and updating and resetting functions', () => {
    renderComponent();
    expect(state).to.eql({});
    expect(patchState.name).to.equal('patchState');
    expect(resetState.name).to.equal('resetState');
    expect(patchState).to.be.a('function');
    expect(resetState).to.be.a('function');
  });

  it('performs multiple updates', () => {
    renderComponent();
    act(() => patchState({'one.two.three': 3, seven: 7}));
    expect(state).to.eql({one: {two: {three: 3}}, seven: 7});
  });

  it('writes multiple updates expressed as a nested object', () => {
    renderComponent();
    let updates = {one: {two: {three: 'three'}}, five: {six: 6}}
    act(() => patchState(updates));
    expect(state).to.eql(updates);
  });

  it('does a single update', () => {
    let initialState = {count: 22};
    let increment = 2;
    renderComponent(structuredClone(initialState));
    act(() => patchState('count', (count) => count + increment));
    expect(state.count).to.equal(initialState.count + increment);
  });

  it('will not render a component if a state value does not change', () => {
    renderComponent({count: 20});
    expect(renderCount).to.equal(1);
    act(() => patchState('count', 20));
    expect(renderCount).to.equal(1);
  });

  it('resets the entire state to its initial value', () => {
    let initialState = {user: 'user', count: 55};
    renderComponent(initialState);
    act(() => patchState({user: 'another', count(count) {return count + 25}}));
    act(() => resetState());
    expect(state).to.eql(initialState);
  });

  it('overwrites the entire state with a new value', () => {
    let newState = {user: 'user', count: 55};
    renderComponent();
    act(() => patchState({user: 'another', count(count) {return count + 25}}));
    act(() => resetState(newState));
    expect(state).to.eql(newState);
  });

  it('is possible to use an array as a data state structure', () => {
    renderComponent([]);
    act(() => patchState({0: 1, 1: 2, 2: 3}));
    expect(state).to.eql([1, 2, 3]);
  });
});
