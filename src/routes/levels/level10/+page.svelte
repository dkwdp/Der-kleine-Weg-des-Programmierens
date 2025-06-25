<script>
  import { onMount } from 'svelte';
  import { myVariable } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';

  let currentLevelIndex = 10; // z.B. Level 10: for-Schleifen
  let currentStepIndex = 0;
  
  let currentLevel;
  let currentStep;

  function updateLevel() {
    currentLevel = levels.find((lvl) => lvl.id === currentLevelIndex);

    if (currentLevel?.titles?.length) {
      currentStep = {
        title: currentLevel.titles[currentStepIndex],
        description: currentLevel.descriptions[currentStepIndex],
        code: currentLevel.codes[currentStepIndex],
        expectedOutput: currentLevel.expectedOutputs[currentStepIndex]
      };
      myVariable.set(currentStep.code);
    }
  }

  function nextStep() {
    if (currentStepIndex < currentLevel.titles.length - 1) {
      currentStepIndex++;
      updateLevel();
    }
  }

  function prevStep() {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      updateLevel();
    }
  }

  onMount(updateLevel);
</script>

<main>
  {#if currentStep}
    <h1>{currentStep.title}</h1>
    <p>{@html currentStep.description}</p>

    <div class="navigation">
      <button on:click={prevStep} disabled={currentStepIndex === 0}>Zurück</button>
      <button on:click={nextStep} disabled={currentStepIndex === currentLevel.titles.length - 1}>Weiter</button>
    </div>
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
  }
</style>