<script lang="ts">
    export let icon: string;
    export let small: boolean = false;
</script>

<svg class="icon" class:small>
    <use xlink:href="build/sprites.svg#{icon}"></use>
</svg>

<style lang="stylus">
.icon
    width 1.5em
    height @width
    vertical-align middle
    color inherit
    fill none
    &.small
        width 1.25em
        height @width
</style>