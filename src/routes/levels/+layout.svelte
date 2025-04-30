<script>
    import { onMount } from 'svelte';
  
    let pyodide = null;
    let pythonInput = '';
    let output = '';
  
    // Pyodide dynamisch laden
    async function loadScript(src) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }
  
    // Beim Laden der Seite Pyodide initialisieren
    onMount(async () => {
      await loadScript('https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.js');
      pyodide = await loadPyodide();
      console.log('✅ Pyodide geladen');
    });
  
    // Python ausführen
    async function runPython() {
      if (!pyodide) {
        output = '⏳ Pyodide lädt noch...';
        return;
      }
  
      try {
        const result = await pyodide.runPythonAsync(pythonInput);
        console.log('Pyodide result:', result);
        output = String(result);
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
  
    textarea {
      width: 100%;
      font-family: monospace;
    }
  
    input.output-field {
      width: 100%;
      margin-top: 0.5rem;
      padding: 0.3rem;
      font-family: monospace;
      background: #f0f0f0;
      border: 1px solid #ccc;
    }
  </style>
  
  <!-- Navigation -->
  <nav>
    <a href="/">home</a> |
    <a href="/levels/level1">level1</a> |
    <a href="/levels/level2">level2</a>
  </nav>
  
  <!-- Seiteninhalt -->
  <slot />
  
  <!-- Statischer Inhalt -->
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
  
  <!-- Pyodide UI -->
  <div class="pyodide-section">
    <h2>Python ausführen (via Pyodide)</h2>
  
    <textarea
      bind:value={pythonInput}
      rows="5"
      placeholder="Schreibe Python-Code..."
    ></textarea>
  
    <br />
  
    <button on:click={runPython}>Ausführen</button>
  
    {#if output}
      <h3>Ausgabe:</h3>
      <input class="output-field" type="text" readonly bind:value={output} />
    {/if}
  </div>
  