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
  <div class="mascot-wrapper">
    <img 
      src={imageSrc} 
      alt="Pinguin-Maskottchen" 
      class="mascot-image"
      key={emotion}
    />
  </div>
  
  {#if message}
    {#key message}
      <div class="speech-bubble">
        {message}
      </div>
    {/key}
  {/if}
</div>

<style>
  .mascot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 120px;
    height: 120px;
    z-index: 1000;
  }

  .mascot-wrapper {
    position: relative;
    width:110%;
    height: 110%;
    overflow: hidden;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  }

  .mascot-image {
    /* Bild genau so groß wie der Container */
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
    animation: 
      gentleBob 4s ease-in-out infinite;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
  }

  /* Sanfte Schwebe-Animation */
  @keyframes gentleBob {
    0%, 100% { 
      transform: translateY(0px) scale(1);
    }
    50% { 
      transform: translateY(-3px) scale(1.02);
    }
  }

  /* Lebendige Speech Bubble */
  .speech-bubble {
    position: absolute;
    bottom: 100%;
    right: -10px;
    margin-bottom: 12px;
    padding: 10px 14px;
    background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
    border: 2px solid #000000;
    border-radius: 15px;
    max-width: 220px;
    min-width: 100px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.3;
    color: #000000;
    text-align: center;
    
    box-shadow: 
      0 6px 20px rgba(74, 144, 226, 0.2),
      0 2px 8px rgba(0, 0, 0, 0.1);
    
    transform-origin: bottom center;
  }

  /* Speech Bubble Pfeil */
  .speech-bubble::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid #ffffff;
  }

  .speech-bubble::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #000000;
  }
</style>