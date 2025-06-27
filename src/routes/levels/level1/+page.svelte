<script>
  import { myVariable, isCurrentLevelDrawing, solvedLevel, levelID, outputID, unlockNextLevel } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let currentLevelIndex = 0;
  let currentLevel = levels[currentLevelIndex];
  let solvedTasks = new Array(currentLevel.description.length).fill(false);
  
  onMount(() => {
    outputID.set(0);  // ← WICHTIG: outputID initialisieren!
    myVariable.set(currentLevel.initialCode[0]);
    solvedLevel.set(false);
    levelID.set(currentLevelIndex);
  });

  // Verwende nur $outputID, nicht i
  $: if ($solvedLevel && $outputID >= 0) {
    solvedTasks[$outputID] = true;  // ← Verwende $outputID
    checkLevelCompletion();
  }

  function nextTask() {
    let currentTask = $outputID + 1;  // ← Neue lokale Variable
    
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
    let currentTask = Math.max(0, $outputID - 1);  // ← Verhindert negative Werte
    
    outputID.set(currentTask);
    myVariable.set(currentLevel.initialCode[currentTask]);
    solvedLevel.set(false);
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
  <h1>{currentLevel.title[$outputID]}</h1>  <!-- ← Verwende $outputID statt i -->
  <h2>Levelbeschreibung</h2>
  <p>{currentLevel.description[$outputID]}</p>
  {#if currentLevel.hints}
      <h3>💡 Tipps:</h3>
       <p>{currentLevel.hints[$outputID]}</p>
  {/if}

  {#if $solvedLevel}
    {#if $outputID > 0}
      <button on:click={previousTask}>Zurück</button>
    {/if}
    {#if $outputID + 1 < currentLevel.description.length}
      <button on:click={nextTask}>Weiter</button>
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