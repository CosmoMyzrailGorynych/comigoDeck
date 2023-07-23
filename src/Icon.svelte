<script lang="ts">
    export let icon: string;
</script>

<svg class="icon">
    <use xlink:href="build/sprites.svg#{icon}"></use>
</svg>

<style lang="stylus">
.icon
    width 1.5em
    height @width
    vertical-align middle
    color inherit
    fill none
</style>