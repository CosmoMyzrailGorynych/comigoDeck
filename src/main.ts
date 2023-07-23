import App from './App.svelte';
import './filter';

import {watch} from 'fs';
watch('./build', {
    recursive: true,
    persistent: false
}, () => {
    console.log('reloading')
    nw.App.quit();
});

const app = new App({
    target: document.body
});