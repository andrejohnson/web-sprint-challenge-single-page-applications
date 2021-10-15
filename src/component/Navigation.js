import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Navigation () {
    const history = useHistory()
    return(
        <div>
            <button id='order-pizza' onClick={()=> history.push('/pizza')}>Home</button>
        </div>
    )
}