<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { myVariable} from "$lib/stores/editorStore";
  import JavaScriptEditor from "$lib/JavaScriptEditor.svelte";
  import levels from '$data/levels.json'; //json datei mit level-lösungen
 
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
</script>

<main>
  <div class="sidebar">
    <slot />
  </div>

  <div class="editor-area">
    <h2>JavaScript Editor</h2>
    <JavaScriptEditor />
    <button on:click={runJavaScript}> Ausführen</button>

    {#if output}
      <h3>Ausgabe:</h3>
      <pre class="output">{output}</pre>
    {/if}
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

  .sidebar {
    width: 40%;
    background-color: var(--bg-light);
    padding: 2rem;
    box-sizing: border-box;
    color: var(--text-dark);
  }

  .editor-area {
    width: 60%;
    padding: 2rem;
    background-color: var(--code-bg);
    box-sizing: border-box;
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
