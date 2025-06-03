<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { myVariable } from "$lib/stores/editorStore";
  import JavaScriptEditor from "$lib/JavaScriptEditor.svelte";
  import levels from '$data/levels.json';
  
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
        output = "✓ Richtig: " + trimmedOutput;
        emotion = 'happy';
        message = 'Großartig!';
      } else{
        output = "↻ Ergebnis: " + trimmedOutput + " | Erwartet: " + currrentExpectedOutput;
        emotion = 'think';
        message = 'Fast geschafft!';
      }
    } catch (err) {
      output = "⚠️ Fehler: " + err.message;
      emotion = 'sad';
      message = 'Versuche es nochmal';
    }
  }
</script>

<main>
  <div class="container">
    <div class="sidebar">
      <div class="header">
        <h1> Javascript Abenteuer</h1>
        <div class="subtitle">Programmieren lernen mit viel Spaß!</div>
      </div>
      <slot />
    </div>

    <div class="coding-area">
      <div class="editor-container">
        <div class="editor-header">
          <h2><span class="icon">✏️</span> Code Editor</h2>
          <button on:click={runJavaScript}>
            <span class="icon">🌱</span> Ausführen!
          </button>
        </div>
        <JavaScriptEditor />
        
        {#if output}
          <div class="output-container {emotion}">
            <h3><span class="icon">🍃</span> Ergebnis</h3>
            <pre class="output">{output}</pre>
          </div>
        {/if}
      </div>
    </div>
    
    <div class="mascot-container">
      <img src={imageSrc} alt="Waldtier-Maskottchen" class="mascot" />
      {#if message}
        <div class="speech-bubble">{message}</div>
      {/if}
    </div>
  </div>
</main>

<style>
  :root {
    /* Professionelle Waldpalette */
    --primary: #3a7d44;      /* Waldgrün */
    --primary-light: #5d9c47;
    --secondary: #e09f3e;    /* Herbstorange */
    --accent: #8cb369;       /* Frisches Grün */
    --light: #f4f9f1;        /* Hellgrün */
    --dark: #2b463c;         /* Dunkelgrün */
    --success: #6a994e;      /* Erfolgsgrün */
    --error: #bc4749;        /* Erdbeerrot */
    --text: #3a3a3a;         /* Dunkelgrau */
    --border: #d8e2d3;       /* Hellgrün */
    
    /* Design-Tokens */
    --border-radius: 12px;
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
    --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body {
    margin: 0;
    font-family: 'Nunito Sans', 'Segoe UI', system-ui, sans-serif;
    background-color: var(--light);
    color: var(--text);
    line-height: 1.6;
    background-image: 
      linear-gradient(rgba(244, 249, 241, 0.9), rgba(244, 249, 241, 0.9)),
      url('karte Kopie.png');
    background-size: cover;
    background-attachment: fixed;
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

  /* Sidebar - jetzt 40% Breite */
  .sidebar {
    width: 40%;
    min-width: 300px;
    background: white;
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
    border-right: 1px solid var(--border);
    overflow-y: auto;
  }

  .header {
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--primary);
    margin: 0 0 0.25rem 0;
  }

  .subtitle {
    font-size: 1rem;
    color: var(--text);
    opacity: 0.8;
  }

  /* Coding-Bereich - jetzt 60% Breite */
  .coding-area {
    width: 60%;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .editor-container {
    flex: 1;
    padding: 2rem;
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
    color: var(--dark);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    background-color: var(--primary);
    color: white;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
  }

  button:hover {
    background-color: var(--primary-light);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .icon {
    font-size: 1.1em;
  }

  .output-container {
    margin-top: 2rem;
    background: white;
    padding: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-sm);
    border-left: 4px solid var(--border);
    transition: var(--transition);
    flex-shrink: 0;
  }

  .output-container.happy {
    border-left-color: var(--success);
  }

  .output-container.think {
    border-left-color: var(--secondary);
  }

  .output-container.sad {
    border-left-color: var(--error);
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--dark);
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .output {
    white-space: pre-wrap;
    font-family: 'Fira Code', 'Menlo', monospace;
    font-size: 0.95rem;
    line-height: 1.7;
    background: rgba(0, 0, 0, 0.02);
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    max-height: 200px;
    overflow-y: auto;
  }

  .mascot-container {
    position: fixed;
    right: 2rem;
    bottom: 2rem;
    width: 140px;
    z-index: 100;
    transition: var(--transition);
  }

  .mascot {
    width: 100%;
    height: auto;
    filter: drop-shadow(var(--shadow-md));
    transition: var(--transition);
    cursor: pointer;
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
    padding: 0.75rem 1.25rem;
    background: white;
    border-radius: var(--border-radius);
    font-size: 0.95rem;
    box-shadow: var(--shadow-md);
    max-width: 220px;
    text-align: center;
    animation: float 3s ease-in-out infinite;
    border: 1px solid var(--border);
  }

  .speech-bubble:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: white transparent transparent transparent;
  }

  @keyframes float {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-6px); }
  }

  @media (max-width: 1024px) {
    .sidebar {
      width: 35%;
      padding: 1rem;
    }
    
    .editor-container {
      padding: 1.5rem;
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
      padding: 1rem 1.5rem;
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
  }
</style>