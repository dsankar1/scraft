import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { useInterpolator } from './core';

const utils = { log: (...params) => console.log(...params), alert: message => window.alert(message) };

const test = {
    initState: {
        "name": "Bob",
        clicks: 0
    },
    name: "${state.name}",
    clicks: "${state.clicks}",
    buttonLabel: "Click Me ${state.name}",
    onButtonClick: "${funcs.onButtonClick}",
    onNameClick: "${funcs.onNameClick}",
    onMount: "${funcs.onMount}",
    funcs: {
        onMount: {
            func: "${log}",
            params: "Mounted"
        },
        onButtonClick: [
            {
                func: "${_.add}",
                params: ["${state.clicks}", 1]
            },
            {
                func: "${setState}",
                params: {
                    clicks: "${result}"
                }      
            }
        ],
        logClicks: [
            {
                func: "${log}",
                params: "${state.clicks}"
            }
        ],
        onNameClick: [
            {
                func: "${funcs.logClicks}"
            },
            {
                func: "${log}",
                params: "${state}"
            }
        ]
    }
};

const App = () => {
    const props = useInterpolator(test, utils);

    React.useEffect(() => {
        console.log('On Button Click changed');
    }, [props.onButtonClick]);

    React.useEffect(() => {
        console.log('On Name Click changed');
    }, [props.onNameClick]);

    return (
        <div>
            Clicks: {props.clicks}<br />
            <button onClick={props.onButtonClick}>
                {props.buttonLabel}
            </button><br/>
            <button onClick={props.onNameClick}>
                {props.name}
            </button>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
