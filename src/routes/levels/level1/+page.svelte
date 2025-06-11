<script>
  import { myVariable, isCurrentLevelDrawing } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';
    import { onMount } from 'svelte';

  let currentLevelIndex = 0;
  let currentLevel = levels[currentLevelIndex];
  
  onMount(() => {
    myVariable.set(currentLevel.initialCode);
    solvedLevel.set(false);
    levelID.set(currentLevelIndex)
  });

  // Funktion zum Weitergehen ist evtl. noch erforderlich:
  function nextTask() {
    if (currentLevelIndex < levels.length - 1) {
      currentLevelIndex++;
      currentLevel = levels[currentLevelIndex];
    }
  }
</script>

<main>
  <h1>{currentLevel.title}</h1>
  <h2>Levelbeschreibung</h2>
  <p>{currentLevel.description}</p>

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