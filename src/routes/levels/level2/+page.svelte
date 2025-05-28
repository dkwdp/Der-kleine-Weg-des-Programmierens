<script>
  import { onMount } from 'svelte';
  import { get } from "svelte/store";
  import { myVariable, pythonCode, pythonOutput } from '$lib/stores/editorStore';

  // Verwendung der Level-Daten aus der JSON-Datei:
  let currentLevelIndex = 1; // starten beim ersten Level
  let currentLevel = levels[currentLevelIndex];

  onMount(() => {
    myVariable.set(currentLevel.initialCode); // setzen des initialen Codes im Editor
  });
  $: output = $pythonOutput;
  $: input = $pythonCode;
</script>

<h1>Level 2: Zeichnen!</h1>
<p>Zeichne etwas im Canvas:</p>

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