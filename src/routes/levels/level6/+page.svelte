<script>
  import {showOutput,myVariable,isCurrentLevelDrawing,solvedLevel,levelID,outputID,unlockNextLevel} from '$lib/stores/editorStore';
  import levels from '$data/levels.json';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let currentLevelIndex = 5;
  let currentLevel = levels[currentLevelIndex];

  let solvedTasks = new Array(currentLevel.description.length).fill(false);
  let unlockedTasks = new Array(currentLevel.description.length).fill(false);
  unlockedTasks[0] = true; // Nur der erste Sublevel ist anfangs freigeschaltet

  onMount(() => {
    outputID.set(0);
    myVariable.set(currentLevel.initialCode[0]);
    solvedLevel.set(false);
    levelID.set(currentLevelIndex);
  });

  // Wenn ein Sublevel gelöst wurde → merken + nächsten freischalten
  $: if ($solvedLevel && $outputID >= 0) {
    solvedTasks[$outputID] = true;

    if ($outputID + 1 < unlockedTasks.length) {
      unlockedTasks[$outputID + 1] = true;
    }

    checkLevelCompletion();
  }

  function nextTask() {
    let currentTask = $outputID + 1;

    if (currentTask >= currentLevel.description.length) {
      unlockNextLevel(currentLevelIndex + 1);
      goto(`/levels/level${currentLevelIndex + 2}`);
      showOutput.set(false);
      return;
    }


    outputID.set(currentTask);
    myVariable.set(currentLevel.initialCode[currentTask]);
    solvedLevel.set(solvedTasks[currentTask]);
    showOutput.set(false);
  }

  function previousTask() {
    let currentTask = Math.max(0, $outputID - 1);

    outputID.set(currentTask);
    myVariable.set(currentLevel.initialCode[currentTask]);
    solvedLevel.set(solvedTasks[currentTask]);
    showOutput.set(false);
  }

  function checkLevelCompletion() {
    const allTasksSolved = solvedTasks.every(task => task === true);

    if (allTasksSolved) {
      unlockNextLevel(currentLevelIndex + 1);
      console.log(`Level ${currentLevelIndex + 2} wurde freigeschaltet!`);
    }
  }
</script>

<main>
  <h1>{currentLevel.title[$outputID]}</h1>
  <h2>Levelbeschreibung</h2>
  <p>{currentLevel.description[$outputID]}</p>

  {#if currentLevel.hints}
    <h3>💡 Tipps:</h3>
    <p>{currentLevel.hints[$outputID]}</p>
  {/if}

  <div>
    {#if $outputID > 0}
      <button on:click={previousTask}>Zurück</button>
    {/if}

    {#if $solvedLevel && $outputID + 1 < currentLevel.description.length}
      <button on:click={nextTask}>Weiter</button>
    {/if}
  </div>
</main>

<style>
  main {
    padding: 20px;
    text-align: center;
  }

  button {
    padding: 10px 20px;
    margin: 10px;
    font-size: 16px;
    cursor: pointer;
  }
</style>
