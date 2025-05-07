<script>
    // Falls du dynamische Dinge brauchst, kannst du hier noch später etwas einfügen
    import { goto } from '$app/navigation';
    function LevelJoin(level) {
        goto(`/levels/level${level}`);
    }
    
  </script>
  
  <style>
    .background {
      width: 100%;
      height: 100vh;
      overflow: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .map-container {
      position: relative;
      width: 1000px; /* oder so groß wie dein Bild */
      height: 700px; /* passend zum Bild */
      transform-origin: top left;
    }
    
    .map-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .buttons {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .level-button {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.8);
      text-align: center;
      line-height: 40px;
      color: black;
      border: 2px solid #333;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    
    /* Positionen relativ im Container */
    #level1 { top: 13.2%; left: 24.6%; }
    #level2 { top: 20%; left: 20%; }
    #level3 { top: 30%; left: 18%; }
    #level4 { top: 40%; left: 15%; }
    #level5 { top: 35%; left: 26%; }
    #level6 { top: 25%; left: 36%; }
    #level7 { top: 50%; left: 10%; }
    #level8 { top: 47%; left: 22%; }
    #level9 { top: 62%; left: 28%; }
    #level10 { top: 5%; left: 47%; }
    </style>
    
    

<div class="background">
    <div class="map-container">
      <img src="/map.png" alt="Map" class="map-image" />
      <div class="buttons">
        <button id="level1" class="level-button" on:click={() => LevelJoin(1)}>1</button>
        <button id="level2" class="level-button" on:click={() => LevelJoin(2)}>2</button>
        <button id="level3" class="level-button" on:click={() => LevelJoin(3)}>3</button>
        <button id="level4" class="level-button" on:click={() => LevelJoin(4)}>4</button>
        <button id="level5" class="level-button" on:click={() => LevelJoin(5)}>5</button>
        <button id="level6" class="level-button" on:click={() => LevelJoin(6)}>6</button>
        <button id="level7" class="level-button" on:click={() => LevelJoin(7)}>7</button>
        <button id="level8" class="level-button" on:click={() => LevelJoin(8)}>8</button>
        <button id="level9" class="level-button" on:click={() => LevelJoin(9)}>9</button>
        <button id="level10" class="level-button" on:click={() => LevelJoin(10)}>10</button>
      </div>
      </div>
    </div>

  