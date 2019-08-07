import React, { memo } from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { build } from './core';
import config from './config';

const Block = memo(({ onClick, ...style }) => {
    console.log('updated');
    return <div onClick={onClick} style={{ ...style, height: '100%' }} />;
});
const Container = ({ children, ...style }) => (
    <div style={style}>{children}</div>
);
const utils = { log: (...params) => console.log(...params) };

const App = build(config, { Block, Container }, utils);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
