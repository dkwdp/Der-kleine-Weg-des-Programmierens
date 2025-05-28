<script>
  import { onMount } from 'svelte';
  import { myVariable } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';

  let currentLevelIndex = 2; // Level 3 (Index 2)
  let currentLevel = levels[currentLevelIndex];

  onMount(() => {
    myVariable.set(currentLevel.initialCode);
  });

  function nextTask() {
    if (currentLevelIndex < levels.length - 1) {
      currentLevelIndex++;
      currentLevel = levels[currentLevelIndex];
      myVariable.set(currentLevel.initialCode);
    }
  }

  function prevTask() {
    if (currentLevelIndex > 0) {
      currentLevelIndex--;
      currentLevel = levels[currentLevelIndex];
      myVariable.set(currentLevel.initialCode);
    }
  }
</script>

<main>
  <h1>{currentLevel.title}</h1>
  
  <div class="level-info">
    <h2>Aufgabe</h2>
    <p>{currentLevel.description}</p>
    
    {#if currentLevel.hints}
      <h3>💡 Tipps:</h3>
      <ul class="hints">
        {#each currentLevel.hints as hint}
          <li>{hint}</li>
        {/each}
      </ul>
    {/if}
  </div>

  <div class="navigation">
    <button on:click={prevTask} disabled={currentLevelIndex === 0}>
      ← Zurück
    </button>
    <span class="level-counter">Level {currentLevelIndex + 1} von {levels.length}</span>
    <button on:click={nextTask} disabled={currentLevelIndex === levels.length - 1}>
      Weiter →
    </button>
  </div>

  {#if currentLevel.type === 'drawing'}
    <div class="drawing-info">
      <h3>🎨 Verfügbare Zeichenfunktionen:</h3>
      <div class="function-list">
        <code>set_background(farbe)</code> - Hintergrundfarbe setzen<br>
        <code>draw_circle(x, y, radius, farbe)</code> - Kreis zeichnen<br>
        <code>draw_rectangle(x, y, breite, höhe, farbe)</code> - Rechteck zeichnen<br>
        <code>draw_line(x1, y1, x2, y2, farbe)</code> - Linie zeichnen<br>
        <code>draw_text(text, x, y, größe, farbe)</code> - Text zeichnen
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    padding: 1.5rem;
    height: 100%;
    overflow-y: auto;
  }

  .level-info {
    margin-bottom: 2rem;
  }

  h1 {
    color: #172c66;
    margin-bottom: 1rem;
    font-size: 1.8em;
  }

  h2 {
    color: #413C58;
    margin-bottom: 0.5rem;
    font-size: 1.3em;
  }

  h3 {
    color: #413C58;
    margin: 1rem 0 0.5rem 0;
    font-size: 1.1em;
  }

  p {
    line-height: 1.6;
    margin-bottom: 1rem;
    color: #333;
  }

  .hints {
    background-color: rgba(255, 255, 255, 0.7);
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #4CAF50;
  }

  .hints li {
    margin-bottom: 0.5rem;
    color: #333;
  }

  .drawing-info {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #2196F3;
    margin-top: 1rem;
  }

  .function-list {
    font-family: 'Courier New', monospace;
    line-height: 1.8;
    color: #333;
  }

  .function-list code {
    background-color: #f4f4f4;
    padding: 2px 4px;
    border-radius: 3px;
    color: #d63384;
  }

  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0;
    padding-top: 1rem;
    border-top: 2px solid rgba(255, 255, 255, 0.3);
  }

  .level-counter {
    font-weight: bold;
    color: #172c66;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 0.5rem 1rem;
    border-radius: 20px;
  }

  button {
    padding: 0.7rem 1.5rem;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 25px;
    background-color: #413C58;
    color: white;
    transition: all 0.3s ease;
  }

  button:hover:not(:disabled) {
    background-color: #A3C4BC;
    transform: translateY(-2px);
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
</style>