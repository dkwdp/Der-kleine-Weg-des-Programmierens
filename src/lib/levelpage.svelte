<script>
  import {
    showOutput,
    myVariable,
    isCurrentLevelDrawing,
    solvedLevel,
    levelID,
    outputID,
    unlockNextLevel
  } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // diese Prop wird von der Page übergeben
  export let levelIndex;

  let currentLevel;
  let solvedTasks = [];

  onMount(() => {
    currentLevel = levels[levelIndex];
    solvedTasks = new Array(currentLevel.description.length).fill(false);

    myVariable.set(currentLevel.initialCode[0]);
    solvedLevel.set(false);
    levelID.set(levelIndex);
    isCurrentLevelDrawing.set(currentLevel.type == "drawing");
  });

  $: if ($solvedLevel && $outputID >= 0) {
    solvedTasks[$outputID] = true;
    checkLevelCompletion();
  }

  function nextTask() {
    let currentTask = $outputID + 1;

    if (currentTask >= currentLevel.description.length) {
      unlockNextLevel(levelIndex + 1);
      goto(`/levels/level${levelIndex + 2}`);
      showOutput.set(false);
      return;
    }

    outputID.set(currentTask);
    myVariable.set(currentLevel.initialCode[currentTask]);
    solvedLevel.set(false);
    showOutput.set(false);
  }

  function previousTask() {
    let currentTask = Math.max(0, $outputID - 1);

    outputID.set(currentTask);
    myVariable.set(currentLevel.initialCode[currentTask]);
    showOutput.set(false);
  }

  function checkLevelCompletion() {
    const allTasksSolved = solvedTasks.every((task) => task === true);

    if (allTasksSolved) {
      unlockNextLevel(levelIndex + 1);
      console.log(`Level ${levelIndex + 2} wurde freigeschaltet!`);
    }
  }
</script>

<main>
  {#if currentLevel}
    <h1>{currentLevel.title[$outputID]}</h1>
    <p>{currentLevel.description[$outputID]}</p>

    {#if currentLevel.hints}
      <h3>💡 Tipps:</h3>
      <p>{currentLevel.hints[$outputID]}</p>
    {/if}

    {#if $solvedLevel}
      <div>
        {#if $outputID > 0}
        <button on:click={previousTask}>Zurück</button>
      {/if}
        {#if $outputID + 1 < currentLevel.description.length}
          <button on:click={nextTask}>Weiter</button>
        {/if}
      </div>
    {/if}
  {/if}
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
