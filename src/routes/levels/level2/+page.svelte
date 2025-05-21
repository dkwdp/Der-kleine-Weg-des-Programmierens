<script>
  import { onMount } from 'svelte';
  import { get } from "svelte/store";
  import { myVariable, pythonCode, pythonOutput } from '$lib/stores/editorStore';

  import Canvas from '$lib/Canvas/Canvas.svelte';

  onMount(() => {
    myVariable.set(`# Zeichne etwas im Canvas!`);
  });
  $: output = $pythonOutput;
  $: input = $pythonCode;
</script>

<h1>Level 2: Zeichnen!</h1>
<p>Zeichne etwas im Canvas:</p>

<p>{output}</p>
<p>{input}</p>

<Canvas color="black" />