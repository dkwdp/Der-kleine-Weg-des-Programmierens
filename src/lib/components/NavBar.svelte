<script>
    export let goToMap;
    export let goToHome;
  </script>
  
  <div class="navigation-bar">
    <button class="nav-button" on:click={goToMap} aria-label="Zurück zur Karte">
      <span class="icon">🗺️</span>
      <span class="tooltip">Zurück zur Karte</span>
    </button>
    <button class="nav-button" on:click={goToHome} aria-label="Hauptbildschirm">
      <span class="icon">🏠</span>
      <span class="tooltip">Hauptbildschirm</span>
    </button>
  </div>
  
  <style>
    .navigation-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(58, 63, 88, 0.9);
      display: flex;
      justify-content: center;
      padding: 0.5rem;
      gap: 1rem;
      z-index: 90;
      backdrop-filter: blur(5px);
      border-top: 1px solid var(--border);
    }
    
    .nav-button {
      width: 40px;
      height: 40px;
      padding: 0;
      background: var(--primary-light);
      color: var(--secondary);
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      position: relative;
    }
    
    .nav-button .icon {
      font-size: 1.2rem;
    }
    
    .nav-button .tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: var(--secondary);
      color: white;
      padding: 0.3rem 0.6rem;
      border-radius: var(--border-radius);
      font-size: 0.8rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      margin-bottom: 0.5rem;
    }
    
    .nav-button:hover .tooltip {
      opacity: 1;
    }
    
    .nav-button:hover {
      background: var(--primary);
      color: white;
      transform: translateY(-3px) scale(1.1);
    }
  </style>