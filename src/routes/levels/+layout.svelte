<script>
  import { goto } from '$app/navigation';
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { myVariable, isCurrentLevelDrawing, outputID, solvedLevel, levelID } from "$lib/stores/editorStore";
  import JavaScriptEditor from "$lib/JavaScriptEditor.svelte";
  import levels from "$data/levels.json";
  import P5Canvas from "$lib/Canvas/p5Canvas.svelte";
  import { fade } from 'svelte/transition';
  import "/src/data/layout.css";

  let output = "";
  let currentLevel = 0;
  let emotion = 'neutral';
  let message = '';
  let isDragging = false;
  let startX, startLeftWidth;
  let canvasRef;
  let showSettings = false;
  let codeOutput;

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

  function goToMap() {
    window.location.href = '/map';
  }

  function goToHome() {
    window.location.href = '/';
  }

  function goToNextLevel() {
    // Hier Logik für das nächste Level einfügen
    // Zum Beispiel:
    // levelID.update(n => n + 1);
    alert("Nächstes Level wird geladen...");
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
        if (canvasRef) canvasRef.runDrawingCode();
        output = "Zeichnung ausgeführt!";
      } else {
        const result = eval(code);
        const trimmedOutput = captured.trim() || String(result);
        let i = $outputID;
        const expectedOutput = currentLevelData.expectedOutput[i];
        console.log = originalLog;
        codeOutput = trimmedOutput;

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
   let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
  }

  function closeMenu() {
    isOpen = false;
  }

//bottom of script
let loading = false;
  let error = '';
  let code = '';
  let feedback = '';

  async function submitCode() {
    if (codeOutput == levels[$levelID].expectedOutput[$outputID])return;
    loading = true;
    error = '';
    feedback = '';
    const code = get(myVariable);

  
    const prompt = `Dieser Javascript Code wurde von einem Anfänger geschrieben:

\`\`\`javascript 
${code}
\`\`\`
Deine Aufgabe ist: Der Code ist von einem Kind. 
Zeige dem Kind die Fehler und helfe ihm diese zu lösen. 
Sie nett und nicht zu hart. 
Erkläre die Fehler und stelle sicher, dass bei dem Kind alles verständlich ankommt. 
Gib nicht die Lösung vor.
Formatiere deine Antwort übersichtlich. 
Wenn keine Fehler da sind, sei motivierend. 
Beantworte alles in maximal 3 Sätzen mit maximal 7 Wörtern pro Satz. 
Die Antworten im Code sind auf Deutsch und Englisch möglich. 
Antworte immer auf Deutsch. Der erwartete output ist '${levels[$levelID].expectedOutput[$outputID]}' beachte groß- und kleinschreibung und zeichensetzung"`;

console.log(prompt)
    try {
      const res = await fetch('http://141.45.153.208:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      feedback = data.feedback;
      message = feedback;
    } catch (err) {
      error = 'Ups! Da konnte ich nicht helfen.: ' + err.message;
      message = error;
    } finally {
      loading = false;
    }
  }
</script>

<main>
  <div class = "top-bar">
    <button class = "banner-button" on:click={goto('/map')}>
    <img src="/banner.png" alt="Header Background" class="header-image" />
    </button>
    <button class ="beltButton" on:click={toggleMenu}>
  Sammlung
</button>
{#if isOpen}
  <div class="popup-menu">
  
    <button class="close-btn" on:click={closeMenu}>✕</button>

    <div class="image-buttons">
      <img src="/lockedBelt.png" alt="Option 1" />
      <img src="/lockedBelt.png" alt="Option 2" />
      <img src="/lockedBelt.png" alt="Option 3" />
    </div>
  </div>
{/if}

  </div>
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
          <button on:click={() => { runJavaScript(); submitCode();}}>Ausführen</button>
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
        <button class="settings-button" on:click={() => showSettings = !showSettings}>⚙️</button>
        {#if showSettings}
          <div class="settings-menu" transition:fade>
            <button on:click={goToMap}><span>🗺️</span> Zur Karte</button>
            <button on:click={goToHome}><span>🏠</span> Hauptbildschirm</button>
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

  <!-- Neuer dezenter Navigationsbalken -->
  <div class="navigation-bar">
    <button class="nav-button" on:click={goToMap} aria-label="Zurück zur Karte">
      <span class="icon">🗺️</span>
      <span class="tooltip">Zurück zur Karte</span>
    </button>
    <button class="nav-button" on:click={goToHome} aria-label="Hauptbildschirm">
      <span class="icon">🏠</span>
      <span class="tooltip">Hauptbildschirm</span>
    </button>
    <button class="nav-button next-level" on:click={goToNextLevel} aria-label="Nächstes Level">
      <span class="icon">⏭️</span>
      <span class="tooltip">Nächstes Level</span>
    </button>
  </div>
</main>

