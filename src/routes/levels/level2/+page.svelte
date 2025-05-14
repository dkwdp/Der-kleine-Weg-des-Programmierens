<script>
   import { onMount } from 'svelte';
  import { myVariable } from '$lib/stores/editorStore';

   onMount(() => {
  myVariable.set("#funktioniierreeeee biiitteee2222");
    }); // oder abhängig vom Level  
</script>
<h1>Level2</h1>
<p>Aufgabe 2:</p>