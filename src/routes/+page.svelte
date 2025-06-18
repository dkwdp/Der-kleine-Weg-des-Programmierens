<script>
  import { goto } from '$app/navigation';
  import { fade } from 'svelte/transition';

  let started = false;

  function startJourney() {
    started = true;
    setTimeout(() => {
      goto('/map');
    }, 600); // Warte, bis der fade-out durch ist
  }
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background: url('/startbild.png') no-repeat center center fixed;
    background-size: cover;
    color: #fff;
  }

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
    backdrop-filter: brightness(0.9);
  }

  h1 {
    font-size: 3em;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  }

  p {
    font-size: 1.4em;
    margin-bottom: 40px;
    color: #f0f0f0;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }

  button {
    padding: 15px 30px;
    font-size: 1.2em;
    border: none;
    border-radius: 8px;
    background-color: #d64550;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  }

  button:hover {
    background-color: #bfd7b5;
    color: #333;
  }
</style>

{#if !started}
  <div class="container" transition:fade={{ duration: 500 }}>
    <h1>Willkommen zum kleinen Weg des Programmierens</h1>
    <p>Mach dich bereit, die spannende Welt des Programmierens zu entdecken!</p>
    <button on:click={startJourney}>Starte deine Reise</button>
  </div>
{/if}
