<script>
  import { myVariable, isCurrentLevelDrawing, solvedLevel, levelID, outputID, unlockNextLevel } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let currentLevelIndex = 6; // Level 7 = Index 6
  let currentLevel = levels[currentLevelIndex];
  let solvedTasks = new Array(currentLevel.description.length).fill(false);
  let solvedTasks = new Array(currentLevel.description.length).fill(false);
  
  onMount(() => {
    outputID.set(0);
    outputID.set(0);
    myVariable.set(currentLevel.initialCode[0]);
    solvedLevel.set(false);
    levelID.set(currentLevelIndex);
  });

  $: if ($solvedLevel && $outputID >= 0) {
    solvedTasks[$outputID] = true;
    checkLevelCompletion();
  }
    levelID.set(currentLevelIndex);
  });

  $: if ($solvedLevel && $outputID >= 0) {
    solvedTasks[$outputID] = true;
    checkLevelCompletion();
  }

  function nextTask() {
    let currentTask = $outputID + 1;
    
    if (currentTask >= currentLevel.description.length) {
      unlockNextLevel(currentLevelIndex + 1);
      goto(`/levels/level${currentLevelIndex + 2}`);
      return;
    }
    
    outputID.set(currentTask);
    myVariable.set(currentLevel.initialCode[currentTask]);
    solvedLevel.set(false);
  }
  
  function previousTask() {
    let currentTask = Math.max(0, $outputID - 1);
    
    outputID.set(currentTask);
    myVariable.set(currentLevel.initialCode[currentTask]);
    solvedLevel.set(false);
    showOutput.set(false)
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
  <h1>{currentLevel.title[$outputID]}</h1>
  <h2>Levelbeschreibung</h2>
  <p>{currentLevel.description[$outputID]}</p>
  <p>{currentLevel.description[$outputID]}</p>
  {#if currentLevel.hints}
      <h3>💡 Tipps:</h3>
       <p class="hint-text">{currentLevel.hints[$outputID]}</p>
  {/if}

  {#if $solvedLevel}
    <div>
      {#if $outputID + 1 < currentLevel.description.length}
        <button on:click={nextTask} >Weiter</button>
      {/if}
      {#if $outputID > 0}
        <button on:click={previousTask}>Zurück</button>
      {/if}
    </div>
  {/if}
</main>

<style>
  main {
    padding: 20px;
    text-align: center;
  }
  
  .hint-text{
    white-space: pre-wrap; 
  }
</style>