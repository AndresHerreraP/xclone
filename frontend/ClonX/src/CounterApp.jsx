import { useState } from 'react'

export const CounterApp  = ({ Value }) => {

    const [ Counter, setCounter] = useState(Value)

const handleadd = () => {
   setCounter(Counter+1)    
    // setCounter ((c) => c +1 )
}

const handleadd1 = () => {
   setCounter(Counter-1)    
    // setCounter ((c) => c +1 )
}
const Reset = () => {
  setCounter(Value)    
    // setCounter ((c) => c  )
}

return (
    <>
    <h1>CopunterApp</h1>
    <h2>{Counter }</h2>

    <button onClick={ handleadd}>
        +1
    </button>
    <button onClick={ handleadd1}>
        -1
    </button>
    <button onClick={ Reset}>
        Reset
    </button>


</>
)
}