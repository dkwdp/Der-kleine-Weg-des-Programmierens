<script>
  import { myVariable, isCurrentLevelDrawing, solvedLevel, levelID, outputID } from '$lib/stores/editorStore';
  import levels from '$data/levels.json';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

  let currentLevelIndex = 4; // bei jedem Level Anpassen
  let currentLevel = levels[currentLevelIndex];
  
  onMount(() => {
    myVariable.set(currentLevel.initialCode[0]);
    solvedLevel.set(false);
    levelID.set(currentLevelIndex)
  });
  let i = 0;

  function nextTask() {
    i = $outputID;
    i++;
    outputID.set(i);
    myVariable.set(currentLevel.initialCode[i]);
    solvedLevel.set(false);
  }
  function previousTask(){
    i = $outputID;
    i--;
    if(i < 0){
      i = 0;
    }
    outputID.set(i);
    myVariable.set(currentLevel.initialCode[i]);
  }
</script>

<main>
  <h1>{currentLevel.title[i]}</h1>
  <h2>Levelbeschreibung</h2>
  <p>{currentLevel.description[i]}</p>
  {#if currentLevel.hints}
      <h3>💡 Tipps:</h3>
       <p>{currentLevel.hints[i]}</p>
      
  {/if}

  {#if $solvedLevel}
  {#if i > 0}
  <button on:click={previousTask}>Zurück</button>
  {/if}
  {#if  i+1 < currentLevel.description.length }
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