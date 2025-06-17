<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { myVariable, isCurrentLevelDrawing, outputID, solvedLevel, levelID } from "$lib/stores/editorStore";
  import JavaScriptEditor from "$lib/JavaScriptEditor.svelte";
  import levels from "$data/levels.json";
  import P5Canvas from "$lib/Canvas/p5Canvas.svelte";
  import { fade } from 'svelte/transition';

  // Originale Variablen
  let output = "";
  let currentLevel = 0;
  let emotion = 'neutral';
  let message = '';
  let isDragging = false;
  let startX, startLeftWidth;
  let canvasRef;
  let showSettings = false;

  // Pinguin-Interaktionen
  const tips = [
    "Probier mal console.log()!",
    "Vergiss die Semikolons nicht!",
    "Du schaffst das!",
    "Fehler sind zum Lernen da!"
  ];

  const emotionImages = {
    happy: '/PinuHappy.png',
    neutral: '/PinuNeutral.png',
    sad: '/PinuSad.png',
    think: '/PinuThink.png',
    switch: '/PinuSwitch.png',
    neutral2: '/PinuNeutral2.png',
  };

  // Funktionen
  function goToMap() {
    window.location.href = '/map';
  }

  function goToHome() {
    window.location.href = '/';
  }

  function resetLevel() {
    if (confirm("Möchtest du dieses Level wirklich zurücksetzen?")) {
      myVariable.set(levels[$levelID].initialCode || "");
      output = "";
      emotion = 'neutral';
      message = '';
    }
  }

  function handleMascotClick() {
    if (!message) {
      message = tips[Math.floor(Math.random() * tips.length)];
      setTimeout(() => message = '', 3000);
    }
    emotion = emotion === 'neutral' ? 'neutral2' : 'neutral';
  }

  function handleMascotHover() {
    if (emotion === 'neutral') emotion = 'switch';
  }

  function handleMascotLeave() {
    if (emotion === 'switch') emotion = 'neutral';
  }

  $: imageSrc = emotionImages[emotion] || emotionImages.neutral;

  // Resizer-Funktionen
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

  async function runJavaScript() {
    const code = get(myVariable);

    try {
      let captured = "";
      const originalLog = console.log;
      console.log = (...args) => {
        captured += args.join(" ") + "\n";
      };

      const currentLevelData = levels[$levelID];
      if (currentLevelData && currentLevelData.type === "drawing") {
        if (canvasRef) {
          canvasRef.runDrawingCode();
        }
        output = "Zeichnung ausgeführt!";
      } else {
        const result = eval(code);
        const trimmedOutput = captured.trim() || String(result);
        let i = $outputID;
        const expectedOutput = currentLevelData.expectedOutput[i];

        console.log = originalLog;

        if(trimmedOutput === expectedOutput) {
          output = "✓ Richtig: " + trimmedOutput;
          emotion = 'happy';
          message = 'Gut gemacht!';
          solvedLevel.set(true);
        } else {
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
    
    <div class="mascot-and-settings-container">
      <div class="settings-button-container">
        <button class="settings-button" on:click={() => showSettings = !showSettings}>
          ⚙️
        </button>
        
        {#if showSettings}
          <div class="settings-menu" transition:fade>
            <button on:click={resetLevel}>
              <span>🔄</span> Level neu starten
            </button>
            <button on:click={goToMap}>
              <span>🗺️</span> Zur Karte
            </button>
            <button on:click={goToHome}>
              <span>🏠</span> Hauptbildschirm
            </button>
          </div>
        {/if}
      </div>

      <div class="mascot-container">
        <img 
          src={imageSrc} 
          alt="Natur-Maskottchen" 
          class="mascot"
          on:click={handleMascotClick}
          on:mouseover={handleMascotHover}
          on:mouseout={handleMascotLeave}
        />
        {#if message}
          <div class="speech-bubble">{message}</div>
        {/if}
      </div>
    </div>
  </div>
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap");

  :root {
    /* Farbpalette */
    --primary: #F8AA48;
    --primary-light: #FFE8D1;
    --secondary: #413C58;
    --accent: #A3C4BC;
    --light: #F5F9F7;
    --success: #BFD7B5;
    --error: #D64550;
    --text: #413C58;
    --border: #D1E0D7;
    --background: #FFFFFF;
    
    /* Design-Tokens */
    --border-radius: 6px;
    --shadow-sm: 0 1px 3px rgba(65, 60, 88, 0.08);
    --shadow-md: 0 2px 6px rgba(65, 60, 88, 0.1);
    --transition: all 0.2s ease;
  }

  /* Container für Pinguin + Einstellungen */
  .mascot-and-settings-container {
    position: fixed;
    right: 1.5rem;
    bottom: 1.5rem;
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    z-index: 100;
  }

  /* Einstellungs-Button */
  .settings-button-container {
    position: relative;
    margin-bottom: 0.5rem;
  }

  .settings-button {
    background: var(--primary-light);
    border: 2px solid var(--primary);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1.2rem;
  }

  .settings-button:hover {
    background: var(--primary);
    color: white;
    transform: rotate(90deg);
  }

  .settings-menu {
    position: absolute;
    right: 0;
    bottom: 50px;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    min-width: 180px;
    overflow: hidden;
    border: 1px solid var(--border);
  }

  .settings-menu button {
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    background: none;
    border: none;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--text); /* Schriftfarbe angepasst */
  }

  .settings-menu button:hover {
    background: var(--primary-light);
  }

  .settings-menu button span {
    font-size: 1.1rem;
    filter: brightness(0.8); /* Icons etwas dunkler */
  }

  /* Originales CSS */
  body {
    margin: 0;
    font-family: "Baloo 2", -apple-system, sans-serif;
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

  .sidebar {
    width: 40%;
    min-width: 300px;
    background: var(--background);
    padding: 1.5rem;
    border-right: 1px solid var(--border);
    overflow-y: auto;
    position: relative;
    background-image: linear-gradient(to bottom, var(--background), var(--light));
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
    width: 120px;
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
    transition: transform 0.3s ease, filter 0.2s ease;
    cursor: pointer;
    border-radius: 50%;
    animation: float 3s ease-in-out infinite;
  }

  .mascot:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
    animation-play-state: paused;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
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
    transition: opacity 0.3s ease;
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
    }

    .mascot-and-settings-container {
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

    .mascot-and-settings-container {
      right: 0.75rem;
      bottom: 0.75rem;
      flex-direction: column-reverse;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .mascot-container {
      width: 80px;
    }

    .settings-button-container {
      margin-bottom: 0;
    }

    .resizer {
      display: none;
    }
  }
</style>