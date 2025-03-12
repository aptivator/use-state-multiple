import {useStateMultiple} from '../../src/use-state-multiple';
import './App.css'

export default function App() {
  let [state, patchState, clearState] = useStateMultiple({count: 22});
  let {count = 0, title: {label = 'Vite + React'} = {}} = state;

  return (
    <>
      <h1>{label}</h1>
      <div className="card">
        <button onClick={() => patchState('count', (count = 0) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => patchState('title.label', 'Count ' + count)}>
          Change Title
        </button>
        <button onClick={() => clearState({})}>
          Clear State
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
