import {useState} from 'react';

export function useRender() {
  let render = useState()[1];
  return () => render([]);
}
