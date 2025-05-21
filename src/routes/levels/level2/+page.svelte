<script>
  import { onMount } from 'svelte';
  import { myVariable } from '$lib/stores/editorStore';

  import Canvas from '$lib/Canvas/Canvas.svelte';

  onMount(() => {
    myVariable.set(`# Zeichne etwas im Canvas!`);
  });
</script>

<h1>Level 2: Zeichnen!</h1>
<p>Zeichne etwas im Canvas:</p>

<Canvas color="black" />