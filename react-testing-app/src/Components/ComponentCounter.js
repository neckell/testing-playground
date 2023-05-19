import React, { useReducer } from 'react';

const initialState = 0;
const reducer = (state, action) => {
    if(action === 'increment'){
        return state + 1;
    }
    else if(action === 'decrement'){
        return state - 1;
    }
    else if(action === 'reset'){
        return initialState;
    }
    return state;
}

const ComponentCounter = () => {
    let [count, dispatch] = useReducer(reducer, initialState);

    return (
        <>
            <div>Contador: {count}</div>
            <button onClick={() => dispatch('increment')}>Incrementar</button>
            <button onClick={() => dispatch('decrement')}>Decrementar</button>
            <button onClick={() => dispatch('reset')}>Reset</button>
        </>
    )
}

export default ComponentCounter;