<Modal bind:this={modal} on:close>
    <h1>CoMiGo's Deck</h1>
    <p>Made by CoMiGo Games at 2023 to remind themselves about the obnoxious importance of social media presence.</p>
    <p>Links:</p>
    <ul>
        <li><a on:click|preventDefault={external} href="https://github.com/CosmoMyzrailGorynych/comigoDeck">GitHub</a></li>
        <li><a on:click|preventDefault={external} href="https://comigo.itch.io/deck">itch.io</a></li>
        <li><a on:click|preventDefault={external} href="https://ctjs.rocks/">Will also put a link to my game engine ct.js, why not.</a></li>
    </ul>
    <button on:click={() => external('https://boosty.to/comigo/donate')}>
        <Icon icon="tip" />
        <span>Send a tip</span>
    </button>
    <button on:click={modal.close}>
        <Icon icon="x" />
        <span>Dismiss</span>
    </button>
</Modal>

<script lang="ts" type="module">
    import Icon from './Icon.svelte';
    import Modal from './Modal.svelte';
    let modal: Modal;

    import './icons/tip.svg';
    import './icons/x.svg';

    const external = (e: MouseEvent | string) => {
        if (e instanceof Event) {
            nw.Shell.openExternal((e.target as HTMLAnchorElement).href);
        } else {
            nw.Shell.openExternal(e);
        }
    }

    // Convince VSCode that this file is a module
    export const dummy = void 0;
</script>