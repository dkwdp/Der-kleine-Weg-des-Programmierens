<script>
    export let emotion = 'neutral';
  
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
    <img src="{imageSrc}" alt="Pinguin-Maskottchen" />
  </div>
  
  <style>
    .mascot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 150px;
      height: auto;
      z-index: 1000;
    }
  
    .mascot-container img {
      width: 100%;
      height: auto;
    }
  </style>
  