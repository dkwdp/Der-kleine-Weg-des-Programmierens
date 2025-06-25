<script>
  import { goto } from '$app/navigation';
  
  export let isOpen;
  export let toggleMenu;
  export let closeMenu;
</script>

<div class="top-bar">
  <button class="banner-button" on:click={goto('/map')}>
    <img src="/banner.png" alt="Header Background" class="header-image" />
  </button>
  <button class="beltButton" on:click={toggleMenu}>
    Sammlung
    <span class="tooltip">Sammlung öffnen</span>
  </button>
  
  {#if isOpen}
    <div class="popup-menu">
      <button class="close-btn" on:click={closeMenu}>✕</button>
      <div class="image-buttons">
        <img src="/lockedBelt.png" alt="Option 1" class="belt-icon" />
        <img src="/lockedBelt.png" alt="Option 2" class="belt-icon" />
        <img src="/lockedBelt.png" alt="Option 3" class="belt-icon" />
      </div>
    </div>
  {/if}
</div>

<style>
  .top-bar {
    position: relative;
    transition: all 0.3s ease;
  }
  
  .banner-button {
    padding: 0;
    margin: 0;
    border: none;
    background-color: var(--primary);
    display: block;
    width: 100%;
    height: 100%;
    transition: transform 0.2s ease;
    overflow: hidden;
  }
  
  .banner-button:hover {
    transform: scale(0.98);
  }
  
  .banner-button:hover .header-image {
    transform: scale(1.03);
  }
  
  .header-image {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease;
  }
  
  .beltButton {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 10;
    padding: 8px 16px;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    overflow: hidden;
    position: relative;
  }
  
  .beltButton:hover {
    background-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  }
  
  .beltButton .tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--secondary);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s ease;
    margin-bottom: 5px;
  }
  
  .beltButton:hover .tooltip {
    opacity: 1;
  }
  
  .popup-menu {
    position: absolute;
    top: 95%;
    right: 1%;
    width: 300px;
    height: 200px;
    background-color: var(--secondary);
    border: 2px solid #aaa;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    transform-origin: top right;
    animation: popIn 0.2s ease-out;
  }
  
  @keyframes popIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .close-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: transparent;
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    transition: transform 0.2s ease;
  }
  
  .close-btn:hover {
    transform: rotate(90deg);
  }
  
  .image-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }
  
  .belt-icon {
    width: 50px;
    height: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }
  
  .belt-icon:hover {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
  }
</style>