<script>
 
   import { goto } from '$app/navigation';
    // Funktion zum Weiterleiten zur nächsten Seite
    function startJourney() {
    goto('/map');

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
    .buttons{
      position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 1;
    }
  
    /* Container für zentrierte Inhalte */
    .page-container {
      position: relative;
		width: 100%;
		height: auto;
		max-width: none;
		max-height: none;
		display: flex;
		justify-content: center;
		align-items: center;
    }
    .image-container{
      position: relative;
      width: auto;
      height: 100%;
  overflow: hidden;
    }
  
.homescreen-image {
		width: auto;
		height: 100%;
		object-fit: contain;
		display: block;
		max-width: 100%;
		max-height: 100%;
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
      background-color: #D64550;
      color: #fff;
      width: 30%;
  padding: 15px 30px;
  font-size: 1.2em;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  z-index: 1;
    }
  
    button:hover {
      background-color: #bfd7b5; /* Leichte Grünfarbe als Hover-Effekt */
    }
  </style>
  
  <div class = "page-container">
  <div class="image-container">
    <img src="/homescreen_resized.png" alt="Homescreen" class="homescreen-image" />
  <div class = "buttons">
    <button on:click={startJourney}>Starte deine Reise</button>
    <button on:click={startJourney}>Reise Fortsetzen</button>
    <button on:click={startJourney}>Freier Modus</button>
    </div>

  </div>
  </div>
