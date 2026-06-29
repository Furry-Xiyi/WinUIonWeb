<template>
  <div class="win-avp" :class="{ 'is-playing': playing, 'is-reversed': reversed }">
    <div class="win-avp-logo" :style="{ animationDuration: duration + 'ms' }">
      <div class="win-avp-ring"></div>
      <div class="win-avp-ring small"></div>
      <div class="win-avp-dot one"></div>
      <div class="win-avp-dot two"></div>
      <div class="win-avp-dot three"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  playing: Boolean,
  reversed: Boolean,
  duration: { type: Number, default: 1800 }
});
</script>

<style>
  .win-avp {
    width: 100%;
    height: 100%;
    min-height: 240px;
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .win-avp-logo {
    width: 188px;
    height: 188px;
    position: relative;
    animation: win-avp-spin linear infinite paused;
    animation-direction: normal;
  }

  .win-avp.is-playing .win-avp-logo {
    animation-play-state: running;
  }

  .win-avp.is-reversed .win-avp-logo {
    animation-direction: reverse;
  }

  .win-avp-ring {
    position: absolute;
    inset: 22px;
    border-radius: 50%;
    border: 18px solid color-mix(in srgb, var(--accent-base) 88%, transparent);
    border-left-color: color-mix(in srgb, var(--accent-base) 24%, transparent);
    filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.16));
  }

  .win-avp-ring.small {
    inset: 64px;
    border-width: 10px;
    border-top-color: color-mix(in srgb, var(--accent-base) 32%, white 16%);
    border-right-color: color-mix(in srgb, var(--accent-base) 72%, white 8%);
  }

  .win-avp-dot {
    position: absolute;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--accent-base);
  }

  .win-avp-dot.one {
    top: 14px;
    left: 84px;
  }

  .win-avp-dot.two {
    right: 22px;
    bottom: 48px;
    opacity: 0.78;
  }

  .win-avp-dot.three {
    left: 30px;
    bottom: 42px;
    opacity: 0.55;
  }

  @keyframes win-avp-spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
