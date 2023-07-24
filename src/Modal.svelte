<div class="aModalWrapper" transition:fade={{duration: 200}} on:click|self={close} role="none">
    <div class="aModal" transition:fly={{ y: 32, duration: 200 }}>
        <slot/>
        {#if $$slots.footer}
            <div class="aModalFooter">
                <slot name="footer"/>
            </div>
        {/if}
    </div>
</div>

<script lang="ts">
    import {fly, fade} from 'svelte/transition';
    import {createEventDispatcher} from 'svelte';
    const dispatch = createEventDispatcher();
    export const close = () => dispatch('close');
</script>

<style lang="stylus">
bg = #1A1A2E
bg2 = darken(bg, 2)
.aModalWrapper
    position fixed
    z-index 10
    left 0
    right 0
    top 0
    bottom 0
    padding 1rem
    display flex
    align-items center
    justify-content center
    background rgba(bg, 0.65)
    cursor pointer
.aModal
    padding 1rem 2rem
    background bg
    box-shadow 0 0.25rem 1rem rgba(0, 0, 0, 0.35)
    max-width 20rem
    border-radius 0.5rem
    cursor default
.aModalFooter
    margin 1rem -2rem -1rem
    background bg2
    padding 1rem 2rem
    border-radius 0 0 0.5rem 0.5rem
</style>