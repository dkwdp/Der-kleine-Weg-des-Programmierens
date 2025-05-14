<script>
    // Funktion zum Weiterleiten zur nächsten Seite
    function startJourney() {
      alert('Hier geht es bald weiter zur nächsten Seite!');
      // Später die Navigation zur nächsten Seite implementieren.
    }

  let loading = false;
  let error = '';
  let code = '';
  let feedback = '';

  async function submitCode() {
    loading = true;
    error = '';
    feedback = '';

    try {
      const res = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      feedback = data.feedback;
    } catch (err) {
      error = 'Something went wrong: ' + err.message;
    } finally {
      loading = false;
  }
}
</script>
  
<style>
  /* Hintergrundfarbe der gesamten Seite */
  body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background-color: #f8aa48; /* Warme, einladende Grundfarbe */
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

  <textarea bind:value={code} placeholder="Enter your Python code..." spellcheck="false" rows=3></textarea>
  <button on:click={submitCode} disabled={loading}>
    {#if loading}
      ⏳ Reviewing...
    {:else}
      Submit
    {/if}
  </button>
  
  {#if feedback && !loading}
    <h3>✅ Feedback</h3>
    <p>{feedback}</p>
  {:else if error && !loading}
    <p style="color: red;">❌ {error}</p>
  {/if}
</div>