<script>
  import { onMount } from 'svelte';
  import { writable, get } from 'svelte/store';
  import levels from '$data/levels.json';
  import { myVariable } from '$lib/stores/editorStore';

  let currentLevelIndex = 6; // if/else hat ID 6
  let currentStepIndex = 0;
  let output = '';
  let message = '';
  let emotion = 'neutral';

  let currentLevel;
  let currentStep;

  const emotionImages = {
    happy: '/PinuHappy.png',
    neutral: '/PinuNeutral.png',
    sad: '/PinuSad.png',
    think: '/PinuThink.png',
    switch: '/PinuSwitch.png',
    neutral2: '/PinuNeutral2.png',
  };

  $: imageSrc = emotionImages[emotion] || emotionImages.neutral;

  function updateLevel() {
    currentLevel = levels.find((lvl) => lvl.id === currentLevelIndex);
    if (currentLevel && currentLevel.steps && currentLevel.steps.length > 0) {
      currentStep = currentLevel.steps[currentStepIndex];
      myVariable.set(currentStep.code);
    }
  }

  function nextStep() {
    if (currentLevel && currentStepIndex < currentLevel.steps.length - 1) {
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

  function runCode() {
    try {
      let captured = '';
      const originalLog = console.log;
      console.log = (...args) => {
        captured += args.join(' ') + '\n';
      };

      eval(get(myVariable));

      console.log = originalLog;
      const trimmedOutput = captured.trim();

      const expectedOutput = currentStep.expectedOutput || '';
      if (expectedOutput && trimmedOutput === expectedOutput) {
        output = '✓ Richtig: ' + trimmedOutput;
        emotion = 'happy';
        message = 'Gut gemacht!';
      } else if (expectedOutput) {
        output = '↳ Ergebnis: ' + trimmedOutput + ' | Erwartet: ' + expectedOutput;
        emotion = 'think';
        message = 'Fast geschafft!';
      } else {
        output = trimmedOutput;
        emotion = 'neutral';
        message = '';
      }
    } catch (err) {
      output = '✗ Fehler: ' + err.message;
      emotion = 'sad';
      message = 'Versuch es nochmal!';
    }
  }

  onMount(() => {
    updateLevel();
  });
</script>

<main>
  {#if currentStep}
    <h1>{currentStep.title}</h1>
    <p>{@html currentStep.description}</p>

    <div class="navigation">
      <button on:click={prevStep} disabled={currentStepIndex === 0}>Zurück</button>
      <button on:click={nextStep} disabled={currentStepIndex === currentLevel.steps.length - 1}>Weiter</button>
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
