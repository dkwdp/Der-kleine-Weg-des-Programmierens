<script>
    import { onMount, onDestroy } from 'svelte';
    import { myVariable } from '$lib/stores/editorStore';
    import { get } from 'svelte/store';
  
    let canvasContainer;
    let p5Instance;
    let customFunctions = {};
  
    // Definiere verfügbare Zeichenfunktionen
    function setupCustomFunctions(p) {
      return {
        draw_circle: (x, y, radius, color = 'blue') => {
          p.fill(color);
          p.noStroke();
          p.circle(x, y, radius * 2);
        },
        draw_rectangle: (x, y, width, height, color = 'red') => {
          p.fill(color);
          p.noStroke();
          p.rect(x, y, width, height);
        },
        draw_line: (x1, y1, x2, y2, color = 'black') => {
          p.stroke(color);
          p.strokeWeight(2);
          p.line(x1, y1, x2, y2);
          p.noStroke();
        },
        set_background: (color = 'white') => {
          p.background(color);
        },
        draw_text: (text, x, y, size = 16, color = 'black') => {
          p.fill(color);
          p.textSize(size);
          p.text(text, x, y);
        }
      };
    }
  
    function executeDrawingCode(code) {
      try {
        console.log('Führe Code aus:', code);
        
        // Erstelle eine sichere Ausführungsumgebung mit den custom functions
        const functionNames = Object.keys(customFunctions);
        const functionValues = Object.values(customFunctions);
        
        // Füge console.log hinzu
        functionNames.push('console');
        functionValues.push({
          log: (...args) => console.log(...args)
        });
  
        // Erstelle und führe Funktion aus
        const func = new Function(...functionNames, code);
        func(...functionValues);
        
        console.log('Code erfolgreich ausgeführt');
      } catch (error) {
        console.error('Fehler beim Ausführen des Codes:', error);
        throw error;
      }
    }
  
    onMount(() => {
      // Einfache p5.js Integration ohne dynamisches Laden
      if (typeof window !== 'undefined' && window.p5) {
        initP5();
      } else {
        // Lade p5.js Script
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
        script.onload = () => {
          console.log('p5.js geladen');
          setTimeout(initP5, 100); // Kurz warten bis p5 verfügbar ist
        };
        script.onerror = () => {
          console.error('Fehler beim Laden von p5.js');
        };
        document.head.appendChild(script);
      }
    });
  
    function initP5() {
      if (!window.p5) {
        console.error('p5.js ist nicht verfügbar');
        return;
      }
  
      const sketch = (p) => {
        p.setup = () => {
          const canvas = p.createCanvas(300, 300);
          canvas.parent(canvasContainer);
          p.background(255);
          customFunctions = setupCustomFunctions(p);
          console.log('p5.js Canvas erstellt, Funktionen verfügbar:', Object.keys(customFunctions));
        };
  
        p.draw = () => {
          // Statisches Canvas - wir zeichnen nur auf Aufforderung
        };
      };
  
      try {
        p5Instance = new window.p5(sketch);
        console.log('p5 Instanz erstellt');
      } catch (error) {
        console.error('Fehler beim Erstellen der p5 Instanz:', error);
      }
    }
  
    onDestroy(() => {
      if (p5Instance) {
        p5Instance.remove();
      }
    });
  
    // Funktion zum Ausführen des Codes im Editor
    export function runDrawingCode() {
      console.log('runDrawingCode aufgerufen');
      if (!p5Instance) {
        console.error('p5 Instanz nicht verfügbar');
        return;
      }
      
      if (Object.keys(customFunctions).length === 0) {
        console.error('Custom functions nicht verfügbar');
        return;
      }
  
      try {
        p5Instance.background(255); // Canvas leeren
        const code = get(myVariable);
        console.log('Führe Code aus:', code);
        executeDrawingCode(code);
      } catch (error) {
        console.error('Fehler beim Ausführen:', error);
        throw error;
      }
    }
  
    // Funktion zum Leeren des Canvas
    export function clearCanvas() {
      if (p5Instance) {
        p5Instance.background(255);
      }
    }
  </script>
  
  <div class="canvas-container">
    <h3>Zeichenfläche</h3>
    <div class="canvas-wrapper" bind:this={canvasContainer}>
      <!-- p5.js Canvas wird hier eingefügt -->
    </div>
    <div class="canvas-controls">
      <button on:click={runDrawingCode}>🎨 Zeichnung ausführen</button>
      <button on:click={clearCanvas}>🗑️ Canvas leeren</button>
    </div>
  </div>
  
  <style>
    .canvas-container {
      margin: 1rem 0;
      padding: 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      background-color: #f9f9f9;
    }
  
    .canvas-container h3 {
      margin: 0 0 1rem 0;
      color: #333;
      text-align: center;
    }
  
    .canvas-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
      min-height: 300px; /* Platz für Canvas reservieren */
      border: 1px dashed #ccc;
      background-color: white;
    }
  
    .canvas-controls {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
  
    .canvas-controls button {
      padding: 0.5rem 1rem;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
      font-size: 14px;
    }
  
    .canvas-controls button:hover {
      background-color: #45a049;
    }
  
    .canvas-controls button:nth-child(2) {
      background-color: #f44336;
    }
  
    .canvas-controls button:nth-child(2):hover {
      background-color: #da190b;
    }
  </style>