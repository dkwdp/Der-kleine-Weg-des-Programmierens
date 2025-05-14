<!-- src/routes/page1.svelte -->
<script>
  import { myVariable } from '$lib/stores/editorStore';

  myVariable.set("#funktioniierreeeee biiitteee"); // oder abhängig vom Level  

  // Aufgaben und dazugehörige Texte
  let tasks = [
    { title: 'Aufgabe 1.1', text: 'Dies ist der Text für Aufgabe 1.1' },
    { title: 'Aufgabe 1.2', text: 'Dies ist der Text für Aufgabe 1.2' },
    { title: 'Aufgabe 1.3', text: 'Dies ist der Text für Aufgabe 1.3' }
  ];

  let currentTaskIndex = 0;

  function nextTask() {
    if (currentTaskIndex < tasks.length - 1) {
      currentTaskIndex++;
    }
  }
</script>
<main>
<h1>Level1</h1>
<p>Hier die Aufgabe</p>
<h2>{tasks[currentTaskIndex].title}</h2>
<p>{tasks[currentTaskIndex].text}</p>

<button on:click={nextTask}>Weiter</button>
</main>

<style>
main {
  padding: 20px;
  text-align: center;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>