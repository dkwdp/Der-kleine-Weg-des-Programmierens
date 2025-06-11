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
  <img src={imageSrc} alt="Natur-Maskottchen" class="mascot" />
  {#if message}
    <div class="speech-bubble">{message}</div>
  {/if}
</div>

<style>
  .mascot-container {
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    width: 140px;
    z-index: 100;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    background: #FFFFFF;
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 0 20px rgba(163, 196, 188, 0.5);
    border: 3px solid #A3C4BC;
  }

  .mascot {
    width: 100%;
    height: auto;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    border-radius: 50%;
  }

  .mascot:hover {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(0 0 8px rgba(248, 170, 72, 0.3));
  }

  .speech-bubble {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 1rem;
    padding: 0.75rem 1.25rem;
    background: #FFFFFF;
    border-radius: 12px;
    font-size: 0.95rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-width: 220px;
    text-align: center;
    animation: float 3s ease-in-out infinite;
    border: 2px solid #BFD7B5;
    color: #3A3A3A;
  }

  .speech-bubble:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: #FFFFFF transparent transparent transparent;
  }

  @keyframes float {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-6px); }
  }

  @media (max-width: 1024px) {
    .mascot-container {
      width: 120px;
      right: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .mascot-container {
      width: 100px;
      right: 1rem;
      bottom: 1rem;
    }
  }
</style>