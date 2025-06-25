<script>
    import { fade } from 'svelte/transition';
    
    export let emotion;
    export let message;
    export let showSettings;
    export let goToMap;
    export let goToHome;
    
    // Diese Funktionen werden von der Elternkomponente bereitgestellt
    export let handleMascotClick;
    export let handleMascotHover; 
    export let handleMascotLeave;
  
    // Bildpfade für die verschiedenen Emotionen
    const emotionImages = {
      happy: '/PinuHappy.png',
      neutral: '/PinuNeutral.png',
      sad: '/PinuSad.png',
      think: '/PinuThink.png',
      switch: '/PinuSwitch.png',
      neutral2: '/PinuNeutral2.png',
    };
    
    // Automatische Bildauswahl basierend auf Emotion
    $: imageSrc = emotionImages[emotion] || emotionImages.neutral;
  </script>
  
  <div class="mascot-and-settings-container">
    <!-- Einstellungs-Button -->
    <div class="settings-button-container">
      <button class="settings-button" on:click={() => showSettings = !showSettings}>⚙️</button>
      {#if showSettings}
        <div class="settings-menu" transition:fade>
          <button on:click={goToMap}><span>🗺️</span> Zur Karte</button>
          <button on:click={goToHome}><span>🏠</span> Hauptbildschirm</button>
        </div>
      {/if}
    </div>
    
    <!-- Maskottchen mit Interaktionen -->
    <div class="mascot-container">
      <img 
        src={imageSrc} 
        alt="Natur-Maskottchen" 
        class="mascot"
        on:click={handleMascotClick}
        on:mouseover={handleMascotHover}
        on:mouseout={handleMascotLeave}
      />
      
      <!-- Sprechblase mit Nachricht -->
      {#if message}
        <div class="speech-bubble" transition:fade>
          {message}
        </div>
      {/if}
    </div>
  </div>
  
  <style>
    .mascot-and-settings-container {
      position: fixed;
      right: 1.5rem;
      bottom: 5rem;
      display: flex;
      align-items: flex-end;
      gap: 1rem;
      z-index: 100;
    }
    
    .settings-button-container {
      position: relative;
      margin-bottom: 0.5rem;
    }
    
    .settings-button {
      background: var(--primary-light);
      border: 2px solid var(--primary);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 1.2rem;
    }
    
    .settings-button:hover {
      background: var(--primary);
      color: white;
      transform: rotate(90deg);
    }
    
    .settings-menu {
      position: absolute;
      right: 0;
      bottom: 50px;
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-md);
      min-width: 180px;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    
    .settings-menu button {
      width: 100%;
      padding: 0.75rem 1rem;
      text-align: left;
      background: none;
      border: none;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: var(--text);
    }
    
    .settings-menu button:hover {
      background: var(--primary-light);
    }
    
    .settings-menu button span {
      font-size: 1.1rem;
      filter: brightness(0.8);
    }
    
    .mascot-container {
      width: 120px;
      transition: var(--transition);
      background: var(--background);
      border-radius: 50%;
      padding: 6px;
      box-shadow: var(--shadow-sm);
      border: 2px solid var(--accent);
      position: relative;
    }
    
    .mascot {
      width: 100%;
      height: auto;
      transition: transform 0.3s ease, filter 0.2s ease;
      cursor: pointer;
      border-radius: 50%;
      animation: float 3s ease-in-out infinite;
    }
    
    .mascot:hover {
      transform: scale(1.05);
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      animation-play-state: paused;
    }
    
    .speech-bubble {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 0.75rem;
      padding: 0.5rem 0.75rem;
      background: var(--background);
      border-radius: var(--border-radius);
      font-size: 0.85rem;
      box-shadow: var(--shadow-sm);
      width: max-content;
      max-width: 200px;
      text-align: center;
      border: 1px solid var(--success);
      color: var(--text);
      font-weight: 400;
    }
    
    .speech-bubble:after {
      content: "";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: var(--background) transparent transparent transparent;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  </style>