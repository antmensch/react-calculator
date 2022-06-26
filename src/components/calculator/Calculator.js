import React, {useReducer} from 'react'
import DigitButton from '../digitButton/digitButton';
import OperationButton from '../operationButton/OperationButton';
import './Calculator.css'

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate',
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
})

function formatOperand(operand) {
    if (operand == null) return;
    const [integer, decimal] = operand.split('.');
    if (decimal == null) return INTEGER_FORMATTER.format(integer);
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}



function Calculator() {
    
    const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {});

    function reducer(state, {type, payload}) {
        function evaluate ({previousOperand, currentOperand, operation}) {
            const prev = parseFloat(previousOperand);
            const curr = parseFloat(currentOperand);
            if (isNaN(prev) || isNaN(curr)) return "";
            let computation =""
            switch (operation) {
                case "+": {
                    computation = prev + curr;
                }
                break;

                case "-": {
                    computation = prev - curr;
                }
                break;

                case "÷": {
                    computation = prev / curr;
                }
                break;

                case "*": {
                    computation = prev * curr;
                }
                break;
            }
            return computation.toString();
        }
        switch (type) {
            case ACTIONS.ADD_DIGIT:
                if (state.overwrite) {
                    return {
                        ...state,
                        currentOperand: payload.digit,
                        overwrite: false
                    }
                }
                if (payload.digit === "0" && state.currentOperand === "0") {
                    return state;
                }

                if (payload.digit === "." && state.currentOperand.includes(".") ) {
                    return state;
                }

                return {
                    ...state,
                    currentOperand: `${state.currentOperand || ""}${payload.digit}`
                };
            case ACTIONS.CHOOSE_OPERATION:
                if (state.currentOperand == null) {
                    return {
                        ...state,
                        operation: payload.operation,
                    }
                }
                if (state.currentOperand == null && state.previousOperand == null) {
                    return state;
                }

                if (state.previousOperand == null  && state.currentOperand != null)
                    return {
                        ...state,
                        operation: payload.operation,
                        previousOperand: state.currentOperand,
                        currentOperand: null,
                    }
                
                return {
                    ...state,
                    previousOperand: evaluate(state),
                    operation: payload.operation,
                    currentOperand: null,
                };
            case ACTIONS.CLEAR: 
            return {};
            case ACTIONS.DELETE_DIGIT:
                if (state.overwrite) {
                    return {
                        ...state,
                        currentOperand: null,
                        overwrite:false,
                    }
                }
                if (state.currentOperand == null) {
                    return state;
                }
                if (state.currentOperand.length == 1) {
                    return {
                        ...state,
                        currentOperand: null
                    }
                }

                return {
                    ...state,
                    currentOperand: state.currentOperand.slice(0, -1),
                }
            case ACTIONS.EVALUATE:
                if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
                    return state;
                }

                return {
                    ...state,
                    overwrite: true,
                    previousOperand: null,
                    operation: null,
                    currentOperand: evaluate(state),
                }
        }
         
    }
  return (
    <div className='calculator-grid'>
        
        <div className='output'>
            <div className='output--previousOperand'>{formatOperand(previousOperand)}{operation}</div>
            <div className='output--currentOperand'>{formatOperand(currentOperand)}</div>
        </div>

        <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
        <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OperationButton dispatch={dispatch} operation="÷"/>
        <DigitButton dispatch={dispatch} digit="1"/>
        <DigitButton dispatch={dispatch} digit="2"/>
        <DigitButton dispatch={dispatch} digit="3"/>
        <OperationButton dispatch={dispatch} operation="*"/>
        <DigitButton dispatch={dispatch} digit="4"/>
        <DigitButton dispatch={dispatch} digit="5"/>
        <DigitButton dispatch={dispatch} digit="6"/>
        <OperationButton dispatch={dispatch} operation="+"/>
        <DigitButton dispatch={dispatch} digit="7"/>
        <DigitButton dispatch={dispatch} digit="8"/>
        <DigitButton dispatch={dispatch} digit="9"/>
        <OperationButton dispatch={dispatch} operation="-"/>
        <DigitButton dispatch={dispatch} digit="."/>
        <DigitButton dispatch={dispatch} digit="0"/>
        <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>

    </div>
  )
}
;
export default Calculator;