<script>
	import { goto } from '$app/navigation';
	import Mascot from '../mascot/Mascot.svelte';

	let emotion = 'neutral';
	let message = 'Willkommen!';
	
	// Level-Daten
	const levelData = [
		{ id: 1, x: 60, y: 12, icon: 'polarbear', name: 'Polarbaer', size: 'medium' },
		{ id: 2, x: 42, y: 13, icon: 'raft', name: 'Floß', size: 'medium' },
		{ id: 3, x: 22, y: 22, icon: 'tent', name: 'Zelt', size: 'medium' },
		{ id: 4, x: 52, y: 23, icon: 'fish', name: 'Fisch', size: 'small' },
		{ id: 5, x: 18, y: 29, icon: 'lumberjack', name: 'Holzfaeller', size: 'small' },
		{ id: 6, x: 30, y: 42, icon: 'hut', name: 'Huette', size: 'large' },
		{ id: 7, x: 60, y: 39, icon: 'angler', name: 'Angler', size: 'small' },
		{ id: 8, x: 20, y: 55, icon: 'kid', name: 'Kind', size: 'small' },
		{ id: 9, x: 49, y: 53, icon: 'bridge', name: 'Bruecke', size: 'large' },
		{ id: 10, x: 73, y: 70, icon: 'flower', name: 'Blume', size: 'small' },
		{ id: 11, x: 75, y: 75, icon: 'csc', name: 'Blume', size: 'small' }
	];

	let iconLoadStates = {};

	// Level-Referenz
	function LevelJoin(level) {
		goto(`/levels/level${level}`);
	}

	// Interaktives Maskottchen
	function onLevelHover(level) {
		emotion = 'think';
		message = `${level.name} - Bereit für das Abenteuer?`;
	}

	function onLevelLeave() {
		emotion = 'neutral';
		message = 'Wähle ein Level aus!';
	}

	// Icon Load Error Handler
	function handleIconError(levelId) {
		iconLoadStates[levelId] = false;
		iconLoadStates = { ...iconLoadStates };
	}

	function handleIconLoad(levelId) {
		iconLoadStates[levelId] = true;
		iconLoadStates = { ...iconLoadStates }; 
	}
</script>

<Mascot {emotion} {message} />

<div class="page-container">
	<div class="map-container" role="application">
		<img src="/map.png" alt="Adventure Map" class="map-image" />
		
		<!-- Overlay Header direkt über der Map -->
		<div class="map-header-overlay">
			<h1>Willkommen im  Coder-Dojo Abenteuerpfad!</h1>
		</div>
		
		<!-- Dynamische Level Buttons mit Icons -->
		{#each levelData as level}
			<button 
				class="level-button {level.size}"
				style="top: {level.y}%; left: {level.x}%;"
				on:click={() => LevelJoin(level.id)}
				on:mouseenter={() => onLevelHover(level)}
				on:mouseleave={onLevelLeave}
				title={level.name}
			>
				{#if iconLoadStates[level.id] === false}
					<!-- Fallback: Nur Zahl wenn Icon fehlt -->
					<div class="level-number-only">
						{level.id}
					</div>
				{:else}
					<!-- Icon + Nummer -->
					<img 
						src="/icons/{level.icon}.png" 
						alt="{level.name}"
						class="level-icon"
						on:load={() => handleIconLoad(level.id)}
						on:error={() => handleIconError(level.id)}
					/>
					<div class="level-number-overlay">
						{level.id}
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	/* Global Reset */
	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		overflow-x: hidden;
	}

	/* Main Container */
	.page-container {
		display: flex;
		flex-direction: column;
	}

	.map-container {
		position: relative;
		width: 100%;
		height: 100%;
		max-width: none;
		max-height: none;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.map-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
		max-width: 100%;
		max-height: 100%;
	}

	/* Header Overlay */
	.map-header-overlay {
		position: absolute;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		z-index: 100;
		pointer-events: none;
		
		/* Glasmorphism-Effekt */
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		padding: 1.5rem 2.5rem;
		box-shadow: 
			0 8px 32px rgba(0, 0, 0, 0.1),
			0 4px 16px rgba(0, 0, 0, 0.05);
	}

	.map-header-overlay h1 {
		font-size: clamp(1.5rem, 3.5vw, 2.2rem);
		color: #2c3e50;
		margin: 0 0 0.5rem 0;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	/* Level Buttons */
	.level-button {
		position: absolute;
		transform: translate(-50%, -50%);
		
		/* Icon-Button Styling */
		background: transparent;
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		padding: 2px;
		
		/* Smoother Animationen */
		transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		user-select: none;
		
		/* Basis Shadow */
		filter: drop-shadow(0 8px 25px rgba(0, 0, 0, 0.4));
	}

	/* LARGE Icons */
	.level-button.large {
		width: clamp(180px, 20vw, 400px);
		height: clamp(180px, 20vw, 400px);
		filter: drop-shadow(0 15px 40px rgba(0, 0, 0, 0.6));
	}

	/* MEDIUM Icons */
	.level-button.medium {
		width: clamp(120px, 12vw, 250px);
		height: clamp(120px, 12vw, 250px);
		filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
	}

	/* SMALL Icons */
	.level-button.small {
		width: clamp(80px, 8vw, 150px);
		height: clamp(80px, 8vw, 150px);
		filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.4));
	}

	/* Level Icon Styling */
	.level-icon {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: all 0.3s ease;
	}

	/* Nummer auf dem Icon*/
	.level-number-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		
		font-size: clamp(10px, 1.5vw, 16px);
		color: white;
		font-family: 'Arial Black', sans-serif;
		
		/* Black Outline für bessere Sichtbarkeit */
		text-shadow: 
			-1px -1px 0 #000,
			 1px -1px 0 #000,
			-1px  1px 0 #000,
			 1px  1px 0 #000,
			 0 0 3px rgba(0, 0, 0, 1);
		
		pointer-events: none;
		z-index: 1;
		transition: all 0.3s ease;
	}

	/* Fallback-Buttons */
	.level-number-only {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-family: 'Arial Black', sans-serif;
		background: #4facfe;
		border-radius: clamp(12px, 2vw, 22px);
		border: clamp(3px, 0.5vw, 6px) solid rgba(255, 255, 255, 0.8);
		text-shadow: 0 0 4px rgba(0, 0, 0, 1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		transition: all 0.3s ease;
	}

	/* Größenspezifische Schriftgrößen */
	.level-button.large .level-number-only {
		font-size: clamp(24px, 4vw, 45px);
	}
	.level-button.medium .level-number-only {
		font-size: clamp(20px, 3vw, 32px);
	}
	.level-button.small .level-number-only {
		font-size: clamp(16px, 2.5vw, 24px);
	}

	/* Hover-Effekte - VEREINFACHT */
	.level-button:hover {
		transform: translate(-50%, -50%) scale(1.05);
		filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.5));
	}

	/* Klick-Effekt */
	.level-button:active {
		transform: translate(-50%, -50%) scale(1.15);
		transition: all 0.1s ease;
	}
</style>