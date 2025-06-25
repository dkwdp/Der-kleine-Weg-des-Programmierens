<script>
  import { onMount } from 'svelte';
  import { myVariable } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';

  let currentLevelIndex = 9; // Level 6: if/else
  let currentStepIndex = 0;
  let currentLevel;

  function updateStep() {
    if (!currentLevel) return;
    myVariable.set(currentLevel.codes[currentStepIndex]);
  }

  function nextStep() {
    if (currentStepIndex < currentLevel.titles.length - 1) {
      currentStepIndex++;
      updateStep();
    }
  }

  function prevStep() {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      updateStep();
    }
  }

  onMount(() => {
    currentLevel = levels.find((lvl) => lvl.id === currentLevelIndex);
    updateStep();
  });
</script>

<main>
  {#if currentLevel}
    <h1>{currentLevel.titles[currentStepIndex]}</h1>
    <p>{@html currentLevel.descriptions[currentStepIndex]}</p>

    <div class="navigation">
      <button on:click={prevStep} disabled={currentStepIndex === 0}>Zurück</button>
      <button on:click={nextStep} disabled={currentStepIndex === currentLevel.titles.length - 1}>Weiter</button>
    </div>

    {#if currentLevel.hints && currentLevel.hints.length}
      <h3>Tipps:</h3>
      <ul>
        {#each currentLevel.hints as hint}
          <li>{hint}</li>
        {/each}
      </ul>
    {/if}

  {:else}
    <p>Lade Level...</p>
  {/if}
</main>

<style>
  main {
    padding: 20px;
    font-family: sans-serif;
    max-width: 800px;
    margin: auto;
  }

  button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background: #f8aa48;
    border: none;
    color: white;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  button:hover {
    background: #413c58;
  }

  ul {
    padding-left: 1.2em;
    margin-top: 10px;
  }
</style>