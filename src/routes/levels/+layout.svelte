<script>
  import { onMount } from "svelte";
  import PythonEditor from "$lib/PythonEditor.svelte";
  import { page } from '$app/stores';
  import { derived } from 'svelte/store';

  const sidebar = derived(page, ($page) => $page.metadata?.sidebar || {});

  let pyodide = null;
  let pythonInput = "";
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
    await loadScript(
      "https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.js",
    );
    pyodide = await loadPyodide();
    console.log("✅ Pyodide geladen");
  });

  async function runPython() {
    if (!pyodide) {
      output = "⏳ Pyodide lädt noch...";
      return;
    }

    let captured = "";
    let result;

    pyodide.setStdout({
      batched: (s) => {
        captured += s;
      },
    });

    try {
      result = await pyodide.runPythonAsync(pythonInput);
      output = captured.trim() || String(result);
    } catch (err) {
      output = `❌ Fehler: ${err.message}`;
    }
  }
</script>

<main>

  <div class="editor-section">
    <slot />
  </div>

  <div class="editor-section">
    <nav>
      <a href="/">home</a>
      <a href="/levels/level1">level1</a>
      <a href="/levels/level2">level2</a>
    </nav>

    <div class="pyodide-section">
      <h2>Python-Code Editor</h2>
      <PythonEditor on:input={e => pythonInput = e.detail} />
      <br />
      <button on:click={runPython}>Ausführen</button>

      {#if output}
        <h3>Ausgabe:</h3>
        <input class="output-field" type="text" readonly bind:value={output} />
      {/if}
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
    --code-bg: #e3f2fd59;
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

  .editor-section {
    flex: 1;
    padding: 2rem;
    background-color: var(--bg-dark);
  }

  nav {
    margin-bottom: 1rem;
  }

  nav a {
    margin-right: 1rem;
    text-decoration: none;
    color: var(--accent);
  }

  .pyodide-section {
    margin-top: 1rem;
    padding: 1rem;
    background-color: var(--code-bg);
    border-radius: 8px;
    height: auto;
  }

  .output-field {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.5rem;
    font-family: monospace;
    background: var(--bg-dark);
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--accent-hover);
  }
</style>
