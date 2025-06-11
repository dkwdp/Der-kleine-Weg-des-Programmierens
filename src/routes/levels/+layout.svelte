<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { myVariable, isCurrentLevelDrawing , outputID, solvedLevel } from "$lib/stores/editorStore";
  import JavaScriptEditor from "$lib/JavaScriptEditor.svelte";
  import levels from "$data/levels.json"; //json datei mit level-lösungen
  import Mascot from "../mascot/Mascot.svelte";
  import P5Canvas from "$lib/Canvas/p5Canvas.svelte";
  import { TreeIndentContext } from "@codemirror/language";

  let output = "";
  let currentLevel = 0;
  let emotion = 'neutral';
  let message = '';

  const emotionImages = {
    happy: '/PinuHappy.png',
    neutral: '/PinuNeutral.png',
    sad: '/PinuSad.png',
    think: '/PinuThink.png',
    switch: '/PinuSwitch.png',
    neutral2: '/PinuNeutral2.png',
  };

  $: imageSrc = emotionImages[emotion] || emotionImages.neutral;

  // Resizer-Funktionalität
  let isDragging = false;
  let startX, startLeftWidth;

  function startDrag(e) {
    isDragging = true;
    startX = e.clientX;
    startLeftWidth = document.querySelector('.sidebar').offsetWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  function onDrag(e) {
    if (!isDragging) return;
    
    const container = document.querySelector('.container');
    const sidebar = document.querySelector('.sidebar');
    const dx = e.clientX - startX;
    const newLeftWidth = startLeftWidth + dx;
    
    // Begrenze die minimale und maximale Breite
    const minWidth = 300;
    const maxWidth = container.offsetWidth - 300;
    
    if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
      sidebar.style.width = `${newLeftWidth}px`;
      sidebar.style.flex = '0 0 auto';
    }
  }

  function stopDrag() {
    isDragging = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  onMount(() => {
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    
    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    };
  });
  let canvasRef;

  async function runJavaScript() {
    const code = get(myVariable);

    try {      let captured = "";
      const originalLog = console.log;
      console.log = (...args) => {
        captured += args.join(" ") + "\n";
      };

      // Für Zeichenlevel: Canvas-Code ausführen
      const currentLevelData = levels[currentLevel];
      if (currentLevelData && currentLevelData.type === "drawing") {
        if (canvasRef) {
          canvasRef.runDrawingCode();
        }
        output = "Zeichnung ausgeführt!";
      } else {
        // Normaler JavaScript Code
        const result = eval(code);
        const trimmedOutput = captured.trim() || String(result);
        let i = $outputID;
        const expectedOutput = levels[currentLevel].expectedOutput[i];

        console.log = originalLog;

      if(trimmedOutput === expectedOutput){
        output = "✓ Richtig: " + trimmedOutput;
        emotion = 'happy';
        message = 'Gut gemacht!';
        solvedLevel.set(true);
      } else{
        output = "↳ Ergebnis: " + trimmedOutput + " | Erwartet: " + expectedOutput;
        emotion = 'think';
        message = 'Fast geschafft!';
      }
    }
    } catch (err) {
      output = "✗ Fehler: " + err.message;
      emotion = 'sad';
      message = 'Versuch es nochmal!';
    }
  }
</script>

<main>
  <div class="container">
    <div class="sidebar">
      <div class="header">
        <h1>Javascript Abenteuer</h1>
        <div class="subtitle">Programmieren lernen mit Leichtigkeit</div>
      </div>
      <slot />
    </div>

    <div class="resizer" on:mousedown={startDrag}></div>

    <div class="coding-area">
      <div class="editor-container">
        <div class="editor-header">
          <h2>Code Editor</h2>
          {#if !$isCurrentLevelDrawing}
          <button on:click={runJavaScript}>Ausführen</button>
          {/if}
        </div>
        <JavaScriptEditor />
        {#if $isCurrentLevelDrawing}
          <P5Canvas bind:this={canvasRef} />
        {/if}
          
        
        {#if output}
          <div class="output-container {emotion}">
            <h3>Ergebnis</h3>
            <pre class="output">{output}</pre>
          </div>
        {/if}
      </div>
    </div>
    
    <div class="mascot-container">
      <img src={imageSrc} alt="Natur-Maskottchen" class="mascot" />
      {#if message}
        <div class="speech-bubble">{message}</div>
      {/if}
    </div>
  </div>
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");

  :root {
    /* Farbpalette */
    --primary: #F8AA48;      /* Warmes Orange (Akzent) */
    --primary-light: #FFE8D1; /* Aufgehellte Variante */
    --secondary: #413C58;    /* Tiefes Lila (für Texte) */
    --accent: #A3C4BC;      /* Weiches Grün-Blau (Hintergründe) */
    --light: #F5F9F7;       /* Sehr helles Grün (Haupthintergrund) */
    --success: #BFD7B5;     /* Frisches Grün (Erfolgsmeldungen) */
    --error: #D64550;       /* Warmes Rot (Fehlermeldungen) */
    --text: #413C58;        /* Haupttextfarbe */
    --border: #D1E0D7;      /* Hellgrau-Grün (Bordüren) */
    --background: #FFFFFF;  /* Weiß (für Boxen) */
    
    /* Design-Tokens */
    --border-radius: 6px;
    --shadow-sm: 0 1px 3px rgba(65, 60, 88, 0.08);
    --shadow-md: 0 2px 6px rgba(65, 60, 88, 0.1);
    --transition: all 0.2s ease;
  }

  body {
    margin: 0;
    font-family:
      "Baloo 2",
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;
    font-weight: 400;
    background-color: var(--light);
    color: var(--text);
    line-height: 1.6;
  }

  main {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .container {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  /* Sidebar */
  .sidebar {
    width: 40%;
    min-width: 300px;
    background: var(--background);
    padding: 1.5rem;
    border-right: 1px solid var(--border);
    overflow-y: auto;
    position: relative;
    background-image: linear-gradient(
      to bottom,
      var(--background),
      var(--light)
    );
  }

  .sidebar::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--success));
  }

  /* Resizer */
  .resizer {
    width: 4px;
    background: var(--border);
    cursor: col-resize;
    transition: var(--transition);
    flex-shrink: 0;
  }

  .resizer:hover {
    background: var(--primary);
  }

  .header {
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--secondary);
    margin: 0 0 0.5rem 0;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 0.9rem;
    color: var(--text);
    opacity: 0.7;
    font-weight: 400;
  }

  /* Coding-Bereich */
  .coding-area {
    width: 60%;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    background-color: var(--light);
    background-image: linear-gradient(to bottom, var(--light), var(--accent));
  }

  .editor-container {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-shrink: 0;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--secondary);
    margin: 0;
  }

  h3 {
    font-size: 1rem;
    font-weight: 500;
    color: var(--secondary);
    margin: 0 0 0.5rem 0;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: var(--transition);
  }

  button:hover {
    background-color: var(--secondary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  .output-container {
    margin-top: 1.5rem;
    background: var(--background);
    padding: 1rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
    border-left: 3px solid var(--border);
    transition: var(--transition);
    flex-shrink: 0;
  }

  .output-container.happy {
    border-left-color: var(--success);
    background-color: rgba(191, 215, 181, 0.05);
  }

  .output-container.think {
    border-left-color: var(--secondary);
    background-color: rgba(65, 60, 88, 0.03);
  }

  .output-container.sad {
    border-left-color: var(--error);
    background-color: rgba(214, 69, 80, 0.03);
  }

  .output {
    white-space: pre-wrap;
    font-family: 'Menlo', 'Consolas', monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    background: rgba(163, 196, 188, 0.05);
    padding: 0.75rem;
    border-radius: 6px;
    overflow-x: auto;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid var(--border);
  }

  /* Maskottchen */
  .mascot-container {
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    width: 120px;
    z-index: 100;
    transition: var(--transition);
    background: var(--background);
    border-radius: 50%;
    padding: 6px;
    box-shadow: var(--shadow-sm);
    border: 2px solid var(--accent);
  }

  .mascot {
    width: 100%;
    height: auto;
    transition: var(--transition);
    cursor: pointer;
    border-radius: 50%;
  }

  .mascot:hover {
    transform: scale(1.05);
  }

  /* Sprechblase */
  .speech-bubble {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: var(--background);
    border-radius: var(--border-radius);
    font-size: 0.85rem;
    box-shadow: var(--shadow-sm);
    max-width: 180px;
    text-align: center;
    border: 1px solid var(--success);
    color: var(--text);
    font-weight: 400;
  }

  .speech-bubble:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--background) transparent transparent transparent;
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .sidebar {
      width: 35%;
      padding: 1rem;
    }

    .editor-container {
      padding: 1rem;
    }

    .mascot-container {
      width: 100px;
      right: 1rem;
    }
  }

  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      padding: 1rem;
    }

    .coding-area {
      width: 100%;
      padding-bottom: 100px;
    }

    .mascot-container {
      width: 80px;
      right: 0.75rem;
      bottom: 0.75rem;
    }

    .resizer {
      display: none;
    }
  }
</style>
