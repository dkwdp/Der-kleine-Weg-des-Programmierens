<script>
  import { goto } from '$app/navigation';
  import { gameMode, unlockLevelsUpTo } from '$lib/stores/editorStore';
  
  let selectedLevel = 1;
  
  // Funktion für freien Modus
  function startFreeMode() {
    gameMode.set('free');
    goto('/map');
  }
  
  // Funktion zum Starten mit gewähltem Level
  function startWithSelectedLevel() {
    gameMode.set('progressive');
    unlockLevelsUpTo(selectedLevel);
    goto(`/levels/level${selectedLevel}`);
  }
</script>

<style>
  /* Hintergrundfarbe der gesamten Seite */
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #ffffff;
    overflow: hidden;
  }
  
  /* Container für zentrierte Inhalte */
  .page-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .homescreen-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Buttons Container */
  .buttons {
    position: absolute;
    bottom: 15%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 20px;
    z-index: 10;
    align-items: center;
  }

  /* Level Selection */
  .level-selection {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .level-select {
    padding: 12px 16px;
    font-size: 1.1rem;
    border: 2px solid #3498db;
    border-radius: 10px;
    background: white;
    width: 140px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .level-select:hover {
    border-color: #2980b9;
    box-shadow: 0 6px 16px rgba(52, 152, 219, 0.3);
  }

  .level-select:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }

  /* Button Styling */
  button {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: white;
    padding: 15px 30px;
    font-size: 1.1rem;
    font-weight: 600;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    min-width: 180px;
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  button:hover {
    background: linear-gradient(135deg, #c0392b 0%, #a93226 100%);
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(231, 76, 60, 0.5);
  }

  button:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
  }

  .free-mode-btn {
    background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
    box-shadow: 0 6px 20px rgba(39, 174, 96, 0.4);
  }

  .free-mode-btn:hover {
    background: linear-gradient(135deg, #229954 0%, #1e8449 100%);
    box-shadow: 0 8px 25px rgba(39, 174, 96, 0.5);
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .buttons {
      bottom: 10%;
      gap: 15px;
    }

    button {
      padding: 12px 25px;
      font-size: 1rem;
      min-width: 160px;
    }

    .level-select {
      width: 120px;
      padding: 10px 12px;
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .buttons {
      bottom: 8%;
      gap: 12px;
    }

    button {
      padding: 10px 20px;
      font-size: 0.95rem;
      min-width: 140px;
    }

    .level-select {
      width: 100px;
      padding: 8px 10px;
      font-size: 0.9rem;
    }
  }
</style>

<div class="page-container">
  <div class="image-container">
    <img src="/homescreen_resized.png" alt="CoderDojo Adventure Background" class="homescreen-image" />
    
    <div class="buttons">
      <div class="level-selection">
        <select bind:value={selectedLevel} class="level-select" aria-label="Startlevel auswählen">
          {#each Array(10) as _, i}
            <option value={i + 1}>Level {i + 1}</option>
          {/each}
        </select>
        <button on:click={startWithSelectedLevel}>
          Reiseziel setzen
        </button>
      </div>
      
      <button class="free-mode-btn" on:click={startFreeMode}>
        Freier Modus
      </button>
    </div>
  </div>
</div>