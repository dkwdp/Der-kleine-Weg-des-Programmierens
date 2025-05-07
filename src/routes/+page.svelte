<script>
   import { goto } from '$app/navigation';
    // Funktion zum Weiterleiten zur nächsten Seite
    function startJourney() {
    goto('/mapBackground');

      // Hier kannst du später die Navigation zur nächsten Seite implementieren.
    }
  </script>
  
  <style>
    /* Hintergrundfarbe der gesamten Seite */
    :global(body) {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #ffffff; /* Warme, einladende Grundfarbe */
    }
  
    /* Container für zentrierte Inhalte */
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      text-align: center;
      color: #413c58; /* Dunkle Textfarbe für hohen Kontrast */
    }
  
    h1 {
      font-size: 2.5em;
      margin-bottom: 20px;
    }
  
    p {
      font-size: 1.2em;
      margin-bottom: 40px;
      color: #a3c4bc; /* Leichte, kontrastierende Farbe */
    }
  
    button {
      padding: 15px 30px;
      font-size: 1.2em;
      border: none;
      border-radius: 5px;
      background-color: #d64550; /* Auffällige Rotfarbe für den Button */
      color: #fff;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    button:hover {
      background-color: #bfd7b5; /* Leichte Grünfarbe als Hover-Effekt */
    }
  </style>
  
  <div class="container">
    <h1>Willkommen zum kleinen Weg des Programmierens</h1>
    <p>Mach dich bereit, die spannende Welt des Programmierens zu entdecken!</p>
    <button on:click={startJourney}>Starte deine Reise</button>
  </div>
