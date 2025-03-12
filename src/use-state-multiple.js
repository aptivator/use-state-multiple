import {useRef}                                     from 'react';
import {getAddressesAndValues, performObjectWrites} from './_lib/object-utils';
import {useRender}                                  from './_lib/utils';

export function useStateMultiple(initialState = {}) {
  let state = useRef(initialState);
  let {current} = state;
  let render = useRender();

  function resetState(newState) {
    state.current = newState || initialState;
    render();
  }

  function patchState(address, value) {
    let addressesAndValues = getAddressesAndValues(address, value);
    let valueChanged = performObjectWrites(current, addressesAndValues);

    if(valueChanged) {
      render();
    }
  }

  return [current, patchState, resetState];
}
