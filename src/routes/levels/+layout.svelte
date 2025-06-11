<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { myVariable, isCurrentLevelDrawing } from "$lib/stores/editorStore";
  import JavaScriptEditor from "$lib/JavaScriptEditor.svelte";
  import levels from "$data/levels.json";
  import Mascot from "../mascot/Mascot.svelte";
  import P5Canvas from "$lib/Canvas/p5Canvas.svelte";
  import SettingsDropdown from "$lib/SettingsDropdown.svelte";

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

  let isDragging = false;
  let startX, startLeftWidth;
  let canvasRef;

  function startDrag(e) {
    isDragging = true;
    startX = e.clientX;
    startLeftWidth = document.querySelector('.sidebar').offsetWidth;
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

      const currentLevelData = levels[currentLevel];
      if (currentLevelData && currentLevelData.type === "drawing") {
        if (canvasRef) {
          canvasRef.runDrawingCode();
        }
        output = "Zeichnung ausgeführt!";
      } else {
        const result = eval(code);
        const trimmedOutput = captured.trim() || String(result);
        const expectedOutput = levels[currentLevel].expectedOutput;

        console.log = originalLog;

        if(trimmedOutput === expectedOutput){
          output = "✓ Richtig: " + trimmedOutput;
          emotion = 'happy';
          message = 'Gut gemacht!';
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
        <SettingsDropdown {currentLevel} />
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
  @import url("https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&display=swap");

  :root {
    --primary: #F4A261;
    --primary-light: #FFF6ED;
    --secondary: #4C7355;
    --accent: #56C5C0;
    --success: #A8D672;
    --light: #F1FAF7;
    --error: #E76F51;
    --text: #3A5642;
    --border: #D8EADB;
    --background: #FFFFFF;
    --border-radius: 12px;
    --border-radius-lg: 18px;
    --shadow-sm: 0 3px 6px rgba(60, 90, 72, 0.07);
    --shadow-md: 0 6px 12px rgba(60, 90, 72, 0.12);
    --transition: all 0.3s ease-in-out;
    --font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  }

  /* Einheitliche Mauszeiger */
  body, body * {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%234C7355"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>'), auto;
  }

  button, [onclick], .mascot, .mascot-container {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23F4A261"><path d="M10 4l6 6-6 6-1.4-1.4 4.6-4.6-4.6-4.6z"/></svg>'), pointer;
  }

  .resizer {
    cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%2356C5C0"><path d="M8 4h8v16H8z"/></svg>'), col-resize;
  }

  body {
    margin: 0;
    font-family: var(--font-family);
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
    border-right: 2px dashed var(--border);
    overflow-y: auto;
    position: relative;
    background-image: linear-gradient(
      to bottom,
      var(--background),
      var(--primary-light)
    );
    border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) 0;


  }

  .sidebar::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, var(--primary), var(--accent), var(--success));
    border-radius: 3px;
  }

  .resizer {
    width: 8px;
    background: var(--accent);
    transition: var(--transition);
    flex-shrink: 0;
    border-radius: 4px;
    margin: 0 2px;
  }

  .resizer:hover {
    background: var(--primary);
    transform: scaleX(1.5);
  }

  .header {
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--secondary);
    margin: 0 0 0.5rem 0;
    text-shadow: 2px 2px 0px rgba(0,0,0,0.05);
  }

  .subtitle {
    font-size: 1rem;
    color: var(--text);
    opacity: 0.8;
    font-weight: 500;
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
    margin-bottom: 1.5rem;
    flex-shrink: 0;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--secondary);
    margin: 0;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--secondary);
    margin: 0 0 0.5rem 0;
  }

  button {
    padding: 0.6rem 1.2rem;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
    letter-spacing: 0.5px;
  }

  button:hover {
    background-color: var(--secondary);
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--shadow-md);
  }

  .output-container {
    margin-top: 1.5rem;
    background: var(--background);
    padding: 1.2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
    border-left: 5px solid var(--border);
    transition: var(--transition);
    flex-shrink: 0;
  }

  .output-container.happy {
    border-left-color: var(--success);
    background-color: rgba(191, 215, 181, 0.1);
    animation: bounce 0.5s;
  }

  .output-container.think {
    border-left-color: var(--secondary);
    background-color: rgba(65, 60, 88, 0.1);
  }

  .output-container.sad {
    border-left-color: var(--error);
    background-color: rgba(214, 69, 80, 0.1);
  }

  .output {
    white-space: pre-wrap;
    font-family: 'Comic Neue', cursive, monospace;
    font-size: 0.9rem;
    line-height: 1.6;
    background: rgba(209, 224, 215, 0.3);
    padding: 1rem;
    border-radius: var(--border-radius);
    overflow-x: auto;
    max-height: 200px;
    overflow-y: auto;
    border: 2px dotted var(--border);
  }

  .mascot-container {
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    width: 140px;
    z-index: 100;
    transition: var(--transition);
    background: var(--background);
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    border: 3px solid var(--accent);
    animation: float 3s ease-in-out infinite;
  }

  .mascot {
    width: 100%;
    height: auto;
    transition: var(--transition);
    border-radius: 50%;
  }

  .mascot:hover {
    transform: scale(1.1) rotate(5deg);
  }

  .speech-bubble {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 1rem;
    padding: 0.8rem 1rem;
    background: var(--background);
    border-radius: var(--border-radius-lg);
    font-size: 1rem;
    box-shadow: var(--shadow-md);
    max-width: 200px;
    text-align: center;
    border: 3px solid var(--success);
    color: var(--text);
    font-weight: 500;
  }

  .speech-bubble:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px 8px 0 8px;
    border-style: solid;
    border-color: var(--background) transparent transparent transparent;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @media (max-width: 1024px) {
    .sidebar {
      width: 35%;
      padding: 1.2rem;
    }

    .editor-container {
      padding: 1.2rem;
    }

    .mascot-container {
      width: 120px;
      right: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      padding: 1rem;
      border-radius: 0;
    }

    .coding-area {
      width: 100%;
      padding-bottom: 120px;
    }

    .mascot-container {
      width: 100px;
      right: 1rem;
      bottom: 1rem;
    }

    .resizer {
      display: none;
    }
  }

  .header {
    position: relative; /* Für korrekte Dropdown-Positionierung */
  }
  
  /* Ergänzung für das Dropdown */
  .dropdown-container {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
  }

  .settings-button[aria-expanded="true"] {
  background: var(--primary);
  color: white;
}

</style>