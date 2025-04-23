<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<div class="map-container">
    <img src="/map.png" alt="Level Map" class="map-bg" />

    {#each levels as level}
        <a href={level.route} class="level-icon" style="left: {level.x}; top: {level.y}" title={level.name}>
            🎯
        </a>
    {/each}
</div>

<style>
.map-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.map-bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
}