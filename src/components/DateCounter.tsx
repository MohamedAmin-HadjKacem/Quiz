import { useReducer } from 'react';

const initialState = {
  count: 0,
  step: 1,
};

type ActionType =
  | { type: 'dec' }
  | { type: 'inc' }
  | { type: 'setStep'; payload: number }
  | { type: 'setCount'; payload: number }
  | { type: 'reset' };

function reducer(state: typeof initialState, action: ActionType) {
  const { count, step } = state;

  switch (action.type) {
    case 'dec':
      return { ...state, count: count - step };
    case 'inc':
      return { ...state, count: count + step };
    case 'setStep':
      return { ...state, step: action.payload };
    case 'setCount':
      return { ...state, count: action.payload };
    case 'reset':
      return initialState;
    default:
      throw new Error('Unknown action');
  }
}

function DateCounter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;

  // This mutates the date object.
  const date = new Date();
  date.setDate(date.getDate() + count);

  const dec = function () {
    dispatch({ type: 'dec' });
  };

  const inc = function () {
    dispatch({ type: 'inc' });
  };

  const defineCount = function (e: React.ChangeEvent<HTMLInputElement>) {
    if (!e?.target?.value) throw new Error('No valid input in defineCount');
    dispatch({ type: 'setCount', payload: Number(e.target.value) });
  };

  const defineStep = function (e: React.ChangeEvent<HTMLInputElement>) {
    if (!e?.target?.value) throw new Error('No valid input in defineStep');
    dispatch({ type: 'setStep', payload: Number(e.target.value) });
  };

  const reset = function () {
    dispatch({ type: 'reset' });
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
