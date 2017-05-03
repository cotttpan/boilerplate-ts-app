// ref:
// https://github.com/developit/preact-boilerplate/blob/master/src/index.js
// https://preactjs.com/guide/switching-to-preact

import { h, render } from 'preact';

let root: any;

function run() {
    let App = require('./app/app').default;
    root = render(h(App, {}), document.body, root);
}

if ((module as any).hot) {
    require('preact/devtools');
    (module as any).hot.accept('./app/app', () => requestAnimationFrame(run));
}

run();
