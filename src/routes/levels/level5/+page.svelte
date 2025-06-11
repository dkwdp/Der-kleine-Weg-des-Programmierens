<script>
<<<<<<< HEAD
    import { onMount, onDestroy } from 'svelte';
    import { myVariable, isCurrentLevelDrawing } from '$lib/stores/editorStore';
    import levels from '$data/levels.json';
  
    let currentLevelIndex = 3;
    let currentLevel = levels[currentLevelIndex];
  
    onMount(() => {
      myVariable.set(currentLevel.initialCode);
      isCurrentLevelDrawing.set(currentLevel.type == "drawing");
    });
  
    function nextTask() {
      if (currentLevelIndex < levels.length - 1) {
        currentLevelIndex++;
        currentLevel = levels[currentLevelIndex];
        myVariable.set(currentLevel.initialCode);
      }
    }
  
    function prevTask() {
      if (currentLevelIndex > 0) {
        currentLevelIndex--;
        currentLevel = levels[currentLevelIndex];
        myVariable.set(currentLevel.initialCode);
  
      }
    }
  </script>
  
  <main>
    <h1>{currentLevel.title}</h1>
    
    <div class="level-info">
      <h2>Aufgabe</h2>
      <p>{currentLevel.description}</p>
    </div>
  
  
    {#if currentLevel.type === 'drawing'}
      <div class="drawing-info">
        <h3>🎨 Verfügbare Zeichenfunktionen:</h3>
        <div class="function-list">
          <code>set_background(farbe)</code> - Hintergrundfarbe setzen<br>
          <code>draw_circle(x, y, radius, farbe)</code> - Kreis zeichnen<br>
          <code>draw_rectangle(x, y, breite, höhe, farbe)</code> - Rechteck zeichnen<br>
          <code>draw_line(x1, y1, x2, y2, farbe)</code> - Linie zeichnen<br>
          <code>draw_text(text, x, y, größe, farbe)</code> - Text zeichnen
        </div>
      </div>
    {/if}
  </main>
  
  <style>
    main {
      padding: 1.5rem;
      height: 100%;
      overflow-y: auto;
    }
  
    .level-info {
      margin-bottom: 2rem;
    }
  
    h1 {
      color: #172c66;
      margin-bottom: 1rem;
      font-size: 1.8em;
    }
  
    h2 {
      color: #413C58;
      margin-bottom: 0.5rem;
      font-size: 1.3em;
    }
  
    h3 {
      color: #413C58;
      margin: 1rem 0 0.5rem 0;
      font-size: 1.1em;
    }
  
    p {
      line-height: 1.6;
      margin-bottom: 1rem;
      color: #333;
    }
  
    .hints {
      background-color: rgba(255, 255, 255, 0.7);
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #4CAF50;
    }
  
    .hints li {
      margin-bottom: 0.5rem;
      color: #333;
    }
  
    .drawing-info {
      background-color: rgba(255, 255, 255, 0.8);
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #2196F3;
      margin-top: 1rem;
    }
  
    .function-list {
      font-family: 'Courier New', monospace;
      line-height: 1.8;
      color: #333;
    }
  
    .function-list code {
      background-color: #f4f4f4;
      padding: 2px 4px;
      border-radius: 3px;
      color: #d63384;
    }
  
    .navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 2rem 0;
      padding-top: 1rem;
      border-top: 2px solid rgba(255, 255, 255, 0.3);
    }
  
    .level-counter {
      font-weight: bold;
      color: #172c66;
      background-color: rgba(255, 255, 255, 0.8);
      padding: 0.5rem 1rem;
      border-radius: 20px;
    }
  
    button {
      padding: 0.7rem 1.5rem;
      font-size: 16px;
      cursor: pointer;
      border: none;
      border-radius: 25px;
      background-color: #413C58;
      color: white;
      transition: all 0.3s ease;
    }
  
    button:hover:not(:disabled) {
      background-color: #A3C4BC;
      transform: translateY(-2px);
    }
  
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      transform: none;
    }
  </style>
=======
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let userCode = writable('');
  let consoleOutput = writable('');
  let currentStep = 0;

  const steps = [
    {
      title: "Was ist if/else?",
            description: `In JavaScript benutzt man 'if', um zu fragen: "Stimmt das?" Wenn ja, passiert etwas.
      Beispiel:`,
            code: `let alter = 10;

if (alter >= 18) {
  console.log("Du bist erwachsen!");
} else {
  console.log("Du bist noch ein Kind!");
}`
    },
    {
      title: "Mini-Level: Alter prüfen",
      description: `Ist jemand alt genug fürs Kino? Ergänze die Bedingung so, dass die Ausgabe stimmt.`,
      code: `let alter = 12;

// Ergänze den Code unten:
if (alter >= 16) {
  console.log("Du darfst alleine ins Kino.");
} else {
  console.log("Du brauchst Begleitung.");
}`
    },
    {
      title: "Mini-Level: Farben vergleichen",
      description: `Ändere den Wert der Variable so, dass \"Blau ist cool!\" erscheint.`,
      code: `let farbe = "rot";

if (farbe === "blau") {
  console.log("Blau ist cool!");
} else {
  console.log("Das ist nicht Blau.");
}`
    },
    {
      title: "Bonus: Eigenes Beispiel",
      description: `Erstelle deinen eigenen if/else-Code, z. B. mit Punkten oder Wetter.`,
      code: `let punkte = 25;

if (punkte >= 30) {
  console.log("Du bekommst einen Preis!");
} else {
  console.log("Noch ein paar Punkte mehr!");
}`
    }
  ];

  let current = steps[currentStep];

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++;
      current = steps[currentStep];
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      current = steps[currentStep];
    }
  }

  function runCode() {
    try {
      const log = [];
      const originalLog = console.log;
      console.log = (...args) => log.push(args.join(" "));

      eval(get(userCode));

      console.log = originalLog;
      consoleOutput.set(log.join("\n"));
    } catch (e) {
      consoleOutput.set("Fehler: " + e.message);
    }
  }

  import { get } from 'svelte/store';

  onMount(() => {
    userCode.set(current.code);
  });

  $: current = steps[currentStep];
  $: userCode.set(current.code);
</script>

<main>
  <h1>{current.title}</h1>
  <p>{current.description}</p>

  <textarea bind:value={$userCode} rows="10" cols="60"></textarea>
  <br />
  <button on:click={runCode}>Code ausführen</button>

  <h3>Konsole:</h3>
  <pre>{$consoleOutput}</pre>

  <div style="margin-top: 20px">
    <button on:click={prevStep} disabled={currentStep === 0}>Zurück</button>
    <button on:click={nextStep} disabled={currentStep === steps.length - 1}>Weiter</button>
  </div>
</main>

<style>
  main {
    padding: 20px;
    font-family: sans-serif;
    max-width: 800px;
    margin: auto;
  }
  textarea {
    width: 100%;
    font-family: monospace;
    font-size: 14px;
  }
  button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
  }
  pre {
    background-color: #f4f4f4;
    padding: 10px;
    white-space: pre-wrap;
    border: 1px solid #ccc;
  }
</style>
>>>>>>> level08
