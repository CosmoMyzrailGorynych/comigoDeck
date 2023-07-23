<div class="aModalWrapper" transition:fade={{duration: 200}} on:click|self={close} role="none">
    <div class="aModal" transition:fly={{ y: 32, duration: 200 }}>
        <slot/>
    </div>
</div>

<script lang="ts">
    import {fly, fade} from 'svelte/transition';
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    export const close = () => dispatch('close');
</script>