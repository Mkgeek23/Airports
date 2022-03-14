import React from 'react';
import { Props } from '../App';


const Form:React.FC<Props> = props => {
    return (
        <form onSubmit={props.submit}>
            <input placeholder="Lotnisko A" name="airport1" type="text" value={props.airportA} onChange={props.changePortA}/>&nbsp;-&nbsp;
            <input placeholder="Lotnisko B" name="airport2" type="text" value={props.airportB} onChange={props.changePortB}/>
            <button>Wyszukaj trasę</button>
        </form>
    )
}

export default Form;