<script>
  import { onMount } from 'svelte';
  import PythonEditor from '$lib/PythonEditor.svelte';

  let pyodide = null;
  let pythonInput = '';
  let output = '';

  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  onMount(async () => {
    await loadScript('https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.js');
    pyodide = await loadPyodide();
    console.log('✅ Pyodide geladen');
  });

  async function runPython() {
    if (!pyodide) {
      output = '⏳ Pyodide lädt noch...';
      return;
    }

    let captured = '';
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

<style>
  nav {
    margin-bottom: 1rem;
  }

  .pyodide-section {
    margin-top: 2rem;
    padding: 1rem;
    border: 1px solid #ccc;
    max-width: 600px;
  }

  .output-field {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.3rem;
    font-family: monospace;
    background: #f0f0f0;
    border: 1px solid #ccc;
  }
</style>

<nav>
  <a href="/">home</a> |
  <a href="/levels/level1">level1</a> |
  <a href="/levels/level2">level2</a>
</nav>

<slot />

<h1>Das ist Level X</h1>
<p>Das</p>
<input
  type="text"
  id="name"
  name="name"
  size="40"
  minlength="3"
  maxlength="100"
  style="width: 200px; height: 30px;"
/>

<!-- Pyodide & CodeMirror UI -->
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
