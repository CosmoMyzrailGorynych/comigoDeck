import preprocess from 'svelte-preprocess';

export default {
    preprocess: preprocess({
        defaults: {
            script: 'typescript',
            css: 'stylus'
        }
    })
};
