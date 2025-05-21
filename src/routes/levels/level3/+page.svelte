<script>
    import { onMount } from 'svelte';
    import { myVariable } from '$lib/stores/editorStore';
  
    import Canvas from '$lib/Canvas/Canvas.svelte';
  
    onMount(() => {
      myVariable.set(`# Zeichne etwas im Canvas!\n#r = 5\n#printCircle(r)`);
    });
  </script>
  
  <h1>Level 3: Zeichnen!</h1>
  <p>Zeichne etwas im Canvasmit Code:</p>
  
  <Canvas color="black" />