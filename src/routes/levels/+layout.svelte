<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { myVariable} from "$lib/stores/editorStore";
  import JavaScriptEditor from "$lib/JavaScriptEditor.svelte";
  import levels from '$data/levels.json'; //json datei mit level-lösungen
  import Mascot from '../mascot/Mascot.svelte';

  let output = "";
  let currentLevel = 0; //mit erstem level starten

  async function runJavaScript() {


    const code = get(myVariable);
    // Capture console.log output
    try {
    let captured = "";
    const originalLog = console.log;
    console.log = (...args) => {
      captured += args.join(" ") + "\n";
    };

    const result = eval(code);
    const trimmedOutput = captured.trim() || String(result);
    const currrentExpectedOutput = levels[currentLevel].expectedOutput;

    console.log = originalLog;

      if(trimmedOutput === currrentExpectedOutput){
        output = "richtig. dein ergebnis ist: " + trimmedOutput + " erwartetes ergebnis ist: " +  currrentExpectedOutput;
      } else{
        output = "falsch. dein ergebnis ist: " + trimmedOutput + " erwartetes ergebnis ist: " +  currrentExpectedOutput;
      }
  } catch (err) {
    output = "Fehler: " + err.message;
  }
}
export let emotion = 'neutral';
  export let message = '';

  const emotionImages = {
    happy: '/PinuHappy.png',
    neutral: '/PinuNeutral.png',
    sad: '/PinuSad.png',
    think: '/PinuThink.png',
    switch: '/PinuSwitch.png',
    neutral2: '/PinuNeutral2.png',
  };

  $: imageSrc = emotionImages[emotion] || emotionImages.neutral;
</script>

<main>
  <div class = "container">
    
  <div class="sidebar">
    <slot />
  </div>

  <div class = "containerRight">
  <div class="editor-area">
    <h2>JavaScript Editor</h2>
    <JavaScriptEditor />
    <button on:click={runJavaScript}> Ausführen</button>

    {#if output}
      <h3>Ausgabe:</h3>
      <pre class="output">{output}</pre>
    {/if}
  </div>
  <div class = "speechArea">
  <div class="mascot-container">
  <img src={imageSrc} alt="Pinguin-Maskottchen" />
  {#if message}
    <div class="speech-bubble">{message}</div>
  {/if}
</div>
</div>
  </div>

  </div>
</main>

<style>
  :root {
    --bg-light: #f8a948;
    --bg-dark: #ffffff;
    --text-dark: #172c66;
    --text-light: #3a3a3a;
    --accent: #413C58;
    --accent-hover: #A3C4BC;
    --code-bg: #f5f7fa;
    --border-color: #ccc;
    --dojo-orange: #f8aa48;
    --dojo-violet: #413c58;
    --dojo-gray: #a3c4bc;
    --dojo-green: #bfd7b5;
    --dojo-red: #d64550;
  }
  


  body {
    margin: 0;
    font-family: "Helvetica Neue", sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-light);
  }

  main {
    display: flex;
    height: 100vh;
  }

  .container {
      display: flex;
      height: 100%;
      width: 100%;
    }

  .sidebar {
    flex: 1;
    width: 40%;
    background-color: var(--bg-light);
    padding: 2rem;
    box-sizing: border-box;
    color: var(--text-dark);
  }

  .containerRight{
    flex: 2;
    width: 60%;
    height: auto;
  }

  .containerRight {
    display: flex;
    flex-direction: column;
  }

  .editor-area {
    flex: 1;
    width: 100%;
    height: 70%;
    padding: 2rem;
    background-color: var(--code-bg);
    box-sizing: border-box;
  }
  .speechArea{
    flex: 1;
    background-color: var(--dojo-violet);
    height: 30%;
  }

  .mascot-container {
    background-color: var(--dojo-red);
    position: fixed;
    bottom: 20px;
    right: 200px;
    width: 10%;
    z-index: 1000;
  }

  .mascot-container img {
    width: 100%;
    height: auto;
  }

  .speech-bubble {
    position: absolute;
    bottom: 100%;
    right: 0;
    margin-bottom: 10px;
    padding: 10px;
    background: #fff;
    border: 2px solid #333;
    border-radius: 10px;
    max-width: 200px;
    font-size: 14px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  }

  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--accent-hover);
  }

  pre.output {
    margin-top: 1rem;
    background: #fff;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-family: monospace;
  }
</style>
