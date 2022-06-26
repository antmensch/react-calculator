import { ACTIONS } from "../calculator/Calculator"

export default function DigitButton({dispatch, digit}) {
    console.log (ACTIONS);
    console.log(digit);
    return (
        <button onClick={() => dispatch({type: ACTIONS.ADD_DIGIT, payload: {digit}})}> {digit} </button>
        )
}