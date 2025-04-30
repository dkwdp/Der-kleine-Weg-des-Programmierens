<script>
    import { goto } from '$app/navigation';
    function TestLevelStart(level) {
        goto(`/levels/level${level}`);
    }
    
    </script>

<h1>Welcome to SvelteKit</h1>
<p>kleiner Test</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<button on:click={() => TestLevelStart(1)}>Level 1</button>
<button on:click={() => TestLevelStart(2)}>Level 2</button>

