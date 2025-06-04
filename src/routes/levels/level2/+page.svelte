<script>
  import { myVariable, isCurrentLevelDrawing } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

  // Verwendung der Level-Daten aus der JSON-Datei:
  let currentLevelIndex = 1; // starten beim ersten Level
  let currentLevel = levels[currentLevelIndex];
  
  onMount(() => {
    myVariable.set(currentLevel.initialCode);
  });

  // Funktion zum Weitergehen ist evtl. noch erforderlich:
  function nextTask() {
    window.location.href = `/levels/level${currentLevelIndex+2}`;
  }
</script>

<main>
  <h1>{currentLevel.title}</h1>
  <h2>Levelbeschreibung</h2>
  <p>{currentLevel.description}</p>
  {#if currentLevel.hints}
      <h3>💡 Tipps:</h3>
      <ul class="hints">
        {#each currentLevel.hints as hint}
          <p>{hint}</p>
        {/each}
      </ul>
  {/if}

  <button on:click={nextTask}>Weiter</button>
</main>

<style>
  main {
    padding: 20px;
    text-align: center;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  
</style>