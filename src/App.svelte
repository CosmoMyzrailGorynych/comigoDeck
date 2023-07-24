<main>
  <div class="aFramesWrapper">
    {#each frames as frame, ind (frame.id)}
      <div class="aFrame" style="width: {frame.width}px;">
        <div class="aFrameBar">
          <button title="(Re)load the initial page" class="square" on:click={reload(ind)}>
            <Icon small={true} icon="reload"/>
          </button>
          <span>
            <Icon icon="width" />
            <input style="width: 4rem" title="Width" type="number" min="200" step="8" bind:value={frame.width} on:input={saveFrames} />
          </span>
          <div class="aSpacer" />
          <button class="square" on:click="{() => frameMenu = frameMenu === frame ? null : frame}">
            <Icon small={true} icon="tool"/>
          </button>
          {#if frameMenu === frame}
            <div class="aFrameMenu" transition:fly={{y: 32, duration: 200}}>
              <label>
                <span>URL:</span>
                <br/>
                <input type="url" bind:value={frame.url} title="URL" on:input={saveFrames}/>
              </label>
              <p/>
              <button class="square" on:click={zoomIn(frame)}>
                <Icon icon="zoom-in"/>
                <span>Zoom in</span>
              </button>
              <button class="square" on:click={zoomOut(frame)}>
                <Icon icon="zoom-out"/>
                <span>Zoom out</span>
              </button>
              {#if ind > 0}
                <button class="square" on:click={moveBack(ind)}>
                  <Icon icon="chevron-left"/>
                  <span>Move to the left</span>
                </button>
              {/if}
              {#if ind < (frames.length - 1)}
                <button class="square" on:click={moveForward(ind)}>
                  <Icon icon="chevron-right"/>
                  <span>Move to the right</span>
                </button>
              {/if}
              <button class="square" on:click={deleteFrame(frame)}>
                <Icon small={true} icon="trash"/>
                <span>Delete this column</span>
              </button>
            </div>
          {/if}
        </div>
        <div class="aFrameContainer" bind:offsetWidth={frame.containerWidth} bind:offsetHeight={frame.containerHeight}>
          <webview
            bind:this={frameRefs[ind]}
            title={frame.url} src={frame.url}
            partition="persist:usercontent"
            style="
              width: {frame.containerWidth / frame.zoom}px;
              height: {frame.containerHeight / frame.zoom}px;
              transform: scale({frame.zoom});"
          />
        </div>
      </div>
    {/each}
    <div class="aSpacer" />
    <div class="aSidebar">
      <div class="AppButtons">
        <button title="App settings" on:click={() => showSettings = true}>
          <Icon icon="adjustments"/>
        </button>
        <button title="About" on:click={() => showAbout = true}>
          <Icon icon="ghost"/>
        </button>
      </div>
      <button class="anAddFrameButton" on:click={() => (showAddFrame = true)}>
        <Icon icon="circle-plus"/>
        <br/>
        New column
      </button>
    </div>
  </div>
  {#if showAddFrame}
    <Modal on:close bind:this={settignsModal}>
      <label>
        URL:<br />
        <input type="text" bind:value={newFrame.url} />
      </label>
      <label>
        Width:<br />
        <input type="number" min="200" step="8" bind:value={newFrame.width}/>
      </label>
      <span slot="footer">
        <button on:click={() => (showAddFrame = false)}>
          <Icon icon="x"/>
          Cancel
        </button>
        <button on:click={addFrame}>
          <Icon icon="check"/>
          Add
        </button>
      </span>
    </Modal>
  {/if}
  {#if showSettings}
    <Settings on:close={() => showSettings = false} />
  {/if}
  {#if showAbout}
    <About on:close={() => showAbout = false} />
  {/if}
</main>

<script lang="ts" type="module">
  import './icons/circle-plus.svg';
  import './icons/ghost.svg';
  import './icons/reload.svg';
  import './icons/trash.svg';
  import './icons/x.svg';
  import './icons/zoom-in.svg';
  import './icons/zoom-out.svg';
  import './icons/chevron-left.svg';
  import './icons/chevron-right.svg';
  import './icons/adjustments.svg';
  import './icons/width.svg';
  import './icons/tool.svg';

  import {fly, fade} from 'svelte/transition';

  import Icon from './Icon.svelte';
  import Settings from './Settings.svelte';
  import About from './About.svelte';
  import Modal from './Modal.svelte';
  let settignsModal: Modal;

  type Frame = {
    url: string;
    width: number;
    id: number;
    zoom: number;
    containerWidth?: number;
    containerHeight?: number;
  };
  export let frames: Frame[] = [];
  $: frameRefs = (frameRefs || []).filter(Boolean);
  const saveFrames = () => {
    localStorage.frames = JSON.stringify(frames);
  };
  const loadFrames = () => {
    frames.length = 0;
    if ("frames" in localStorage) {
      frames.push(...JSON.parse(localStorage.frames));
    } else {
      frames.push({
        url: "https://comigo.itch.io/",
        width: 600,
        id: Date.now(),
        zoom: 1
      });
    }
  };
  const deleteFrame = (frame: Frame) => (e) => {
    frames.splice(frames.indexOf(frame), 1);
    frames = frames;
    saveFrames();
  };
  const reload = (ind: number) => () => {
    frameRefs[ind].src = frames[ind].url;
  };

  loadFrames();

  let showAddFrame = false;
  let newFrame: Frame = {
    url: "https://comigo.itch.io/",
    width: 400,
    id: Date.now(),
    zoom: 1
  };

  const addFrame = () => {
    if (!newFrame.url || !newFrame.width) {
      return;
    }
    newFrame.id = Date.now();
    frames.push(newFrame);
    newFrame = {
      url: "https://comigo.itch.io/",
      width: 400,
      id: Date.now(),
      zoom: 1
    };
    frames = frames;
    showAddFrame = false;
    saveFrames();
  };

  const moveForward = (ind: number) => () => {
    frames[ind] = frames.splice(ind + 1, 1, frames[ind])[0];
    frames = frames;
    saveFrames();
  };
  const moveBack = (ind: number) => () => {
    frames[ind] = frames.splice(ind - 1, 1, frames[ind])[0];
    frames = frames;
    saveFrames();
  };

  const zoomIn = (frame: Frame) => () => {
    frame.zoom += 0.1;
    if (frame.zoom > 3) {
      frame.zoom = 3;
    }
    frames = frames;
  };
  const zoomOut = (frame: Frame) => () => {
    frame.zoom -= 0.1;
    if (frame.zoom < 0.5) {
      frame.zoom = 0.5;
    }
    frames = frames;
  };

  let frameMenu: Frame = null;

  let showSettings = false;
  let showAbout = false;

  (window as any).nw.Window.get().maximize();
</script>

<style lang="stylus">
  bg = #1A1A2E
  bg2 = lighten(bg, 10)
  text = #F1F6F9
  accent = #40b19c
  trans =
    transition 0.25s ease
    transition-property background, border
  :global(body)
    margin 0
    padding 0
    font-family system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"
    background bg
    color text
    font-size 16px
    line-height 24px
  :global(a)
    color accent
    opacity 0.75
    transition opacity 0.25s ease
    &:hover
      opacity 1
  .aSpacer
    flex 1 1 auto
  main
    display grid
    width 100vw
    height 100vh
  label
    display block
  .aSidebar
    display flex
    gap 0.5rem
    flex-flow column nowrap
    & > *
      flex 1 1 auto
    padding 0.5rem
  .AppButtons
    flex 0 0 auto
    display flex
    flex-flow row nowrap
    gap 0.25rem
    & > *
      flex 1 1 auto
    & > button
      margin 0
  .aFramesWrapper
    overflow-y hidden
    overflow-x auto
    display flex
    flex-flow row nowrap
    height 100%
    gap 0.5rem
  .aFrameContainer
    overflow hidden
    flex 1 1 auto
  .aFrame
    height 100%
    flex 0 0 auto
    display flex
    flex-flow column nowrap
    iframe, webview
      display block
      border 0
      border-radius 0.5rem
      width 100%
      flex 1 1 auto
      transform-origin top left
    &:first-child
      iframe
        border-radius 0 0.5rem 0.5rem 0
  .aFrameBar
    flex 0 0 auto
    display flex
    flex-flow row nowrap
    padding 0.5rem
    gap 0.25rem
    & > button //, & > .aButtonGroup
      margin 0
    position relative
  .aFrameMenu
    position absolute
    right 0
    top 100%
    padding 0.25rem 0.5rem
    background bg
    box-shadow 0 0.25rem 1rem rgba(0, 0, 0, 0.35)
    z-index 2
    display flex
    flex-flow column nowrap
    gap 0.25rem
    border-radius 0.25rem
    & > *
      margin 0
  :global(button)
    color inherit
    background bg2
    &:active, &:hover
      background accent
    padding 0.25rem 0.5rem
    cursor pointer
    border 0
    border-radius 0.25rem
    {trans}
    font inherit
    box-sizing border-box
    margin 0 0.5rem
    &:first-child
      margin-left 0
    &:last-child
      margin-right 0
    &.square
      padding 0.25rem
    /*
    .aButtonGroup &
      border-radius 0
      margin 0
      &:first-child
        border-top-left-radius 0.25rem
        border-bottom-left-radius 0.25rem
      &:last-child
        border-top-right-radius 0.25rem
        border-bottom-right-radius 0.25rem
  :global(.aButtonGroup)
    margin 0 0.5rem
    display flex
    flex-flow row nowrap
    */
  :global(input)
    color inherit
    background transparent
    border 2px solid bg2
    padding 0.15rem 0.5rem
    border-radius 0.25rem
    outline 0
    box-sizing border-box
    &:focus
      border-color accent
    {trans}
    font inherit
  .anAddFrameButton
    border 0
    margin 0
</style>
