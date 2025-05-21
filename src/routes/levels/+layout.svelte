<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { myVariable,pythonCode, pythonOutput } from "$lib/stores/editorStore";
  import PythonEditor from "$lib/PythonEditor.svelte";

  let pyodide = null;
  let output = "";

  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  onMount(async () => {
    await loadScript("https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.js");
    pyodide = await loadPyodide();
    console.log("✅ Pyodide geladen");
  });

  async function runPython() {
    if (!pyodide) {
      output = "⏳ Pyodide lädt noch...";
      return;
    }

    const code = get(myVariable);

    let captured = "";
    pyodide.setStdout({ batched: (s) => (captured += s) });

    try {
      const result = await pyodide.runPythonAsync(code);
      output = captured.trim() || String(result) || "✅ Ausgeführt";
    
    } catch (err) {
      output = "❌ Fehler: " + err.message;
    }
    pythonOutput.set(output);
    pythonCode.set(code)
  }
</script>

<main>
  <div class="sidebar">
    <slot />
  </div>

  <div class="editor-area">
    <h2>Python-Code Editor</h2>
    <PythonEditor />
    <button on:click={runPython}> Ausführen</button>

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
