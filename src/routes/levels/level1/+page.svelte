<script>
  import { myVariable } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';
    import { onMount } from 'svelte';

  // Verwendung der Level-Daten aus der JSON-Datei:
  let currentLevelIndex = 0; // starten beim ersten Level
  let currentLevel = levels[currentLevelIndex];

  onMount(() => {
    myVariable.set(currentLevel.initialCode); // setzen des initialen Codes im Editor
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