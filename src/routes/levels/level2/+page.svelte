<script>
  import { onMount } from 'svelte';
  import { get } from "svelte/store";
  import { myVariable, pythonCode, pythonOutput } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';

  // Verwendung der Level-Daten aus der JSON-Datei:
  let currentLevelIndex = 1; // starten beim ersten Level
  let currentLevel = levels[currentLevelIndex];

  onMount(() => {
    myVariable.set(currentLevel.initialCode); // setzen des initialen Codes im Editor
    // Wenn du etwas in die Konsole schreiben willst, kannst du console.log verwenden:
    console.log('Aktuelles Level:', currentLevel);
  });
  $: output = $pythonOutput;
  $: input = $pythonCode;
</script>
<main>

  <h1>{currentLevel.title}</h1>
  <h2>Levelbeschreibung</h2>
  <p>{currentLevel.description}</p>

<p>{output}</p>
<p>{input}</p>

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