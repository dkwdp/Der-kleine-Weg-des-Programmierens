<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { myVariable} from "$lib/stores/editorStore";
  import JavaScriptEditor from "$lib/JavaScriptEditor.svelte";
  import levels from '$data/levels.json';
  import Mascot from '../mascot/Mascot.svelte';

  let output = "";
  let currentLevel = 0;

  async function runJavaScript() {
    const code = get(myVariable);
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
        output = "🎉 Richtig! Dein Ergebnis: " + trimmedOutput;
        emotion = 'happy';
        message = 'Super gemacht! Weiter so!';
      } else{
        output = "🤔 Fast! Dein Ergebnis: " + trimmedOutput + " - Erwartet: " +  currrentExpectedOutput;
        emotion = 'think';
        message = 'Fast geschafft! Versuch es nochmal!';
      }
    } catch (err) {
      output = "❌ Oops! Fehler: " + err.message;
      emotion = 'sad';
      message = 'Kein Problem! Probieren wir es nochmal!';
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
  <div class="container">
    <div class="sidebar">
      <h1>👾 JavaScript Abenteuer</h1>
      <div class="level-info">
        <h2>Level {currentLevel + 1}</h2>
        <div class="task-card">
          {levels[currentLevel]?.task || "Schreibe Code um die Aufgabe zu lösen!"}
        </div>
      </div>
      <slot />
    </div>

    <div class="coding-area">
      <div class="editor-container">
        <h2><span class="icon">✏️</span> Code Editor</h2>
        <JavaScriptEditor />
        <button on:click={runJavaScript}>
          <span class="icon">🚀</span> Code ausführen
        </button>

        {#if output}
          <div class="output-container">
            <h3><span class="icon">📤</span> Ausgabe:</h3>
            <pre class="output">{output}</pre>
          </div>
        {/if}
      </div>

      <div class="mascot-area">
        <div class="mascot-container">
          <img src={imageSrc} alt="Pinguin-Maskottchen" class="mascot" />
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
    --primary: #6a5acd;       /* Lila */
    --secondary: #ff9f43;     /* Orange */
    --accent: #48dbfb;       /* Blau */
    --light: #f9f9f9;        /* Hellgrau */
    --dark: #2c3e50;         /* Dunkelblau */
    --success: #1dd1a1;      /* Grün */
    --error: #ff6b6b;        /* Rot */
    --text: #333;            /* Dunkelgrau */
    --border-radius: 12px;
  }

  body {
    margin: 0;
    font-family: "Comic Sans MS", "Comic Neue", cursive;
    background-color: var(--light);
    color: var(--text);
  }

  main {
    height: 100vh;
    overflow: hidden;
  }

  .container {
    display: flex;
    height: 100%;
  }

  .sidebar {
    width: 35%;
    background-color: white;
    padding: 1.5rem;
    box-shadow: 4px 0 10px rgba(0,0,0,0.1);
    overflow-y: auto;
  }

  .sidebar h1 {
    color: var(--primary);
    margin-bottom: 1.5rem;
    font-size: 2rem;
  }

  .level-info {
    background-color: #f0f7ff;
    padding: 1rem;
    border-radius: var(--border-radius);
    margin-bottom: 1.5rem;
    border: 2px dashed var(--accent);
  }

  .task-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1.1rem;
    line-height: 1.5;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .coding-area {
    width: 65%;
    display: flex;
    flex-direction: column;
    background-color: #f5f7fa;
  }

  .editor-container {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .editor-container h2 {
    color: var(--primary);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  button {
    margin-top: 1rem;
    padding: 0.7rem 1.5rem;
    background-color: var(--secondary);
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: all 0.3s;
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  }

  button:hover {
    background-color: #ff8c21;
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0,0,0,0.2);
  }

  .icon {
    margin-right: 8px;
  }

  .output-container {
    margin-top: 1.5rem;
    background: white;
    padding: 1rem;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  .output {
    white-space: pre-wrap;
    font-family: "Courier New", monospace;
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid var(--accent);
  }

  .mascot-area {
    background-color: var(--primary);
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }

  .mascot-container {
    position: relative;
    width: 150px;
  }

  .mascot {
    width: 100%;
    height: auto;
    transition: all 0.3s;
  }

  .mascot:hover {
    transform: scale(1.05);
  }

  .speech-bubble {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 15px;
    padding: 12px;
    background: white;
    border-radius: 20px;
    max-width: 250px;
    font-size: 1rem;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
    animation: bounce 2s infinite;
  }

  .speech-bubble:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }

  @keyframes bounce {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-5px); }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .container {
      flex-direction: column;
    }
    
    .sidebar, .coding-area {
      width: 100%;
      height: auto;
    }
  }
</style>