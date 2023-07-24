<script lang="ts">
    import './icons/check.svg';

    import Modal from './Modal.svelte';
    let modal: Modal;
    import Icon from './Icon.svelte';

    import * as filter from './filter';
    import AutoLaunch from 'auto-launch';

    const changeFilter = () => {
        if (filter.isAdFilterEnabled()) {
            filter.disableAdFilter();
        } else {
            filter.enableAdFilter();
        }
        filterEnabled = filter.isAdFilterEnabled();
        console.log('new value:', filterEnabled);
    };
    let filterEnabled: boolean = filter.isAdFilterEnabled();

    const autolauncher = new AutoLaunch({
        name: 'CoMiGoDeck'
    });
    const toggleAutostart = async () => {
        let enabled = await autolauncher.isEnabled();
        if (enabled) {
            await autolauncher.disable();
        } else {
            await autolauncher.enable();
        }
        autostartEnabled = !enabled;
    };
    let autostartEnabled = false;
    autolauncher.isEnabled().then((enabled: boolean) => autostartEnabled = enabled);
</script>

<Modal on:close bind:this={modal}>
    <h2>Settings</h2>
    <label>
        <input type="checkbox" bind:checked={filterEnabled} on:change={changeFilter} />
        <span>Enable Ad Filter</span>
    </label>
    <br>
    <label>
        <input type="checkbox" bind:checked={autostartEnabled} on:change={toggleAutostart} />
        <span>Automatically start on system start</span>
    </label>
    <span slot="footer">
        <button on:click={modal.close}>
            <Icon icon="check"/>
            <span>Apply</span>
        </button>
    </span>
</Modal>
