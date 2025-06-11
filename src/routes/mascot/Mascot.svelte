<script>
  export let emotion = 'neutral';
  export let message = '';

  const emotionImages = {
    happy: '/PinuHappy.png',
    neutral: '/PinuNeutral.png',
    sad: '/PinuSad.png',
    think: '/PinuThink.png',
    switch: '/PinuSwitch.png',
    neutral2: '/PinuNeutral2.png',
  };

  $: imageSrc = emotionImages[emotion] || emotionImages.neutral;
</script>

<div class="mascot-container">
  <img src={imageSrc} alt="Pinguin-Maskottchen" />
  {#if message}
    <div class="speech-bubble">{message}</div>
  {/if}
</div>

<style>
  .mascot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 150px;
    z-index: 1000;
  }

  .mascot-container img {
    width: 100%;
    height: auto;
  }

  .speech-bubble {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 10px;
    padding: 10px;
    background: #fff;
    border: 2px solid #333;
    border-radius: 10px;
    max-width: 200px;
    font-size: 14px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  }
</style>
