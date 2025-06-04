<script>
	import { goto } from '$app/navigation';
	import Mascot from '../mascot/Mascot.svelte';

	let mascotEmotion = 'neutral';
	let mascotMessage = 'Willkommen!';
	
	// Level-Daten mit Icons
	const levelData = [
		{ id: 1, x: 48, y: 14, icon: 'raft', name: 'Floß' },
		/*
		{ id: 2, x: 15, y: 18, icon: 'tent', name: 'Zelt' },
		{ id: 3, x: 46, y: 19, icon: 'fish', name: 'Fisch' },
		{ id: 4, x: 62, y: 22, icon: 'polarbear', name: 'Polarbaer' },
		{ id: 5, x: 80, y: 31, icon: 'lumberjack', name: 'Holzfaeller' },
		{ id: 6, x: 56, y: 35, icon: 'angler', name: 'Angler' },
		{ id: 7, x: 55, y: 42, icon: 'bridge', name: 'Bruecke' },
		{ id: 8, x: 20, y: 44, icon: 'hut', name: 'Huette' },
		{ id: 9, x: 30, y: 50, icon: 'kid', name: 'Kind' },
		{ id: 10, x: 84, y: 57, icon: 'flower', name: 'Blume' }
		 */
	];

	let iconLoadStates = {};

	function LevelJoin(level) {
		goto(`/levels/level${level}`);
	}

	// Interaktives Maskottchen
	function onLevelHover(level) {
		mascotEmotion = 'think';
		mascotMessage = `${level.name} - Bereit für das Abenteuer?`;
	}

	function onLevelLeave() {
		mascotEmotion = 'neutral';
		mascotMessage = 'Wähle ein Level aus!';
	}

		// Icon Load Error Handler
	function handleIconError(levelId) {
		iconLoadStates[levelId] = false;
		iconLoadStates = { ...iconLoadStates }; // Trigger reactivity
	}

	function handleIconLoad(levelId) {
		iconLoadStates[levelId] = true;
		iconLoadStates = { ...iconLoadStates }; // Trigger reactivity
	}

	// Development-Modus für Koordinaten
	let showDevCoords = false; // Aktiviert zum Testen
	let mouseX = 0;
	let mouseY = 0;

	function handleMouseMove(event) {
		if (!showDevCoords) return;
		const rect = event.currentTarget.getBoundingClientRect();
		mouseX = ((event.clientX - rect.left) / rect.width * 100).toFixed(2);
		mouseY = ((event.clientY - rect.top) / rect.height * 100).toFixed(2);
	}
</script>

<Mascot {mascotEmotion} {mascotMessage} />

<div class="page-container">
	<div class="map-section">
		<div class="map-container" role="application" on:mousemove={handleMouseMove}>
			<img src="/map.png" alt="Adventure Map" class="map-image" />
			
			<!-- Overlay Header direkt über der Map -->
			<div class="map-header-overlay">
				<h1>Willkommen im Abenteuerpfad!</h1>
				<p>Wähle ein Level aus, um deine Reise zu beginnen.</p>
			</div>
			
			<!-- Dynamische Level Buttons mit Icons -->
			{#each levelData as level}
				<button 
					class="level-button"
					style="top: {level.y}%; left: {level.x}%;"
					on:click={() => LevelJoin(level.id)}
					on:mouseenter={() => onLevelHover(level)}
					on:mouseleave={onLevelLeave}
					title={level.name}
				>
					{#if iconLoadStates[level.id] !== false}
						<img 
							src="/icons/{level.icon}.png" 
							alt="{level.name}"
							class="level-icon"
							on:load={() => handleIconLoad(level.id)}
							on:error={() => handleIconError(level.id)}
						/>
					{/if}
					
					{#if iconLoadStates[level.id] === false}
						<!-- Fallback: Nur Zahl wenn Icon fehlt -->
						<div class="level-number-only">
							{level.id}
						</div>
					{:else}
						<!-- Nummer über dem Icon -->
						<div class="level-number-overlay">
							{level.id}
						</div>
					{/if}
				</button>
			{/each}

			<!-- Development Helper -->
			{#if showDevCoords}
				<div class="mouse-coords">
					Mausposition: X = {mouseX}% Y = {mouseY}%
				</div>
			{/if}
		</div>
	</div>
</div>
<style>
	/* CSS Custom Properties für einheitliche Werte */
	:root {
		--map-max-width: 1000px;
		--button-size-desktop: 50px;
		--button-size-tablet: 45px;
		--button-size-mobile: 40px;
		--font-size-desktop: 18px;
		--font-size-tablet: 16px;
		--font-size-mobile: 14px;
		--primary-bg: #f5f5f5;
		--header-color: #333;
		--text-color: #666;
	}

	/* Global Reset */
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		background-color: var(--primary-bg);
		overflow-x: hidden;
	}

	/* Main Container - Fullscreen */
	.page-container {
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		background: linear-gradient(135deg, rgba(191, 215, 181, 0.2) 0%, rgba(191, 215, 181, 0.4) 100%);
	}

	/* Map Section - Fullscreen */
	.map-section {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0;
		position: relative;
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

	/* Header Overlay - schweben über der Map */
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
		
		/* Subtle Animation */
		animation: fadeInDown 1s ease-out;
	}

	.map-header-overlay h1 {
		font-size: clamp(1.5rem, 3.5vw, 2.2rem);
		color: #2c3e50;
		margin: 0 0 0.5rem 0;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.map-header-overlay p {
		font-size: clamp(0.9rem, 2vw, 1.1rem);
		color: #34495e;
		margin: 0;
		font-weight: 500;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	/* Animation für den Header */
	@keyframes fadeInDown {
		0% {
			opacity: 0;
			transform: translateX(-50%) translateY(-20px);
		}
		100% {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	/* Level Buttons - DEUTLICH GRÖßERE ICONS */
	.level-button {
		position: absolute;
		/* Größere Buttons für große Icons */
		width: clamp(70px, 7vw, 95px);
		height: clamp(70px, 7vw, 95px);
		
		/* Zentrieren des Buttons */
		transform: translate(-50%, -50%);
		
		/* Icon-Button Styling */
		background: transparent;
		border: none;
		border-radius: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		/* Minimales Padding für maximalen Icon-Platz */
		padding: 2px;
		
		/* Smoother Animationen */
		transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		user-select: none;
		
		/* Basis Shadow */
		filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25));
	}

	/* Level Icon Styling - GRÖßER! */
	.level-icon {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: all 0.3s ease;
		filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.35));
	}

	/* Nummer über dem Icon - Angepasst für größere Buttons */
	.level-number-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		
		/* Größere Typografie für größere Buttons */
		font-size: clamp(16px, 2.5vw, 22px);
		font-weight: 900;
		color: white;
		font-family: 'Arial Black', sans-serif;
		
		/* Noch stärkere schwarze Outline für bessere Sichtbarkeit */
		text-shadow: 
			-3px -3px 0 #000,
			 3px -3px 0 #000,
			-3px  3px 0 #000,
			 3px  3px 0 #000,
			-2px -2px 0 #000,
			 2px -2px 0 #000,
			-2px  2px 0 #000,
			 2px  2px 0 #000,
			-1px -1px 0 #000,
			 1px -1px 0 #000,
			-1px  1px 0 #000,
			 1px  1px 0 #000,
			 0 0 6px rgba(0, 0, 0, 1);
		
		pointer-events: none;
		z-index: 10;
		transition: all 0.3s ease;
	}

	/* Verbesserte Fallback-Buttons - Größer */
	.level-number-only {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		
		/* Größere Typografie für größere Buttons */
		font-size: clamp(24px, 4vw, 34px);
		font-weight: 900;
		color: white;
		font-family: 'Arial Black', sans-serif;
		
		/* Attraktiver Gradient */
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
		border-radius: 18px;
		border: 5px solid rgba(255, 255, 255, 0.8);
		
		/* Starker Text-Schatten */
		text-shadow: 
			-3px -3px 0 rgba(0, 0, 0, 0.9),
			 3px -3px 0 rgba(0, 0, 0, 0.9),
			-3px  3px 0 rgba(0, 0, 0, 0.9),
			 3px  3px 0 rgba(0, 0, 0, 0.9),
			 0 0 8px rgba(0, 0, 0, 1);
		
		/* Plastischer 3D-Effekt */
		box-shadow: 
			0 8px 20px rgba(0, 0, 0, 0.35),
			inset 0 3px 0 rgba(255, 255, 255, 0.5),
			inset 0 -3px 0 rgba(0, 0, 0, 0.25);
		
		/* Transition für Hover */
		transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	/* Reaktive Hover-Effekte - Verstärkt für größere Buttons */
	.level-button:hover {
		transform: translate(-50%, -50%) scale(1.05);
		filter: drop-shadow(0 12px 30px rgba(0, 0, 0, 0.45));
	}

	.level-button:hover .level-icon {
		filter: 
			drop-shadow(0 6px 18px rgba(0, 0, 0, 0.6))
			brightness(1.2)
			saturate(1.4);
	}

	.level-button:hover .level-number-overlay {
		text-shadow: 
			-3px -3px 0 #000,
			 3px -3px 0 #000,
			-3px  3px 0 #000,
			 3px  3px 0 #000,
			 0 0 12px rgba(0, 0, 0, 1),
			 0 0 24px rgba(255, 255, 255, 0.9);
		transform: translate(-50%, -50%) scale(1.05);
	}

	/* Spektakulärer Hover für größere Fallback-Buttons */
	.level-button:hover .level-number-only {
		background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
		border-color: rgba(255, 255, 255, 1);
		transform: scale(1.08);
		
		box-shadow: 
			0 12px 35px rgba(0, 0, 0, 0.45),
			inset 0 4px 0 rgba(255, 255, 255, 0.7),
			inset 0 -4px 0 rgba(0, 0, 0, 0.35),
			0 0 30px rgba(79, 172, 254, 0.6);
			
		text-shadow: 
			-3px -3px 0 rgba(0, 0, 0, 1),
			 3px -3px 0 rgba(0, 0, 0, 1),
			-3px  3px 0 rgba(0, 0, 0, 1),
			 3px  3px 0 rgba(0, 0, 0, 1),
			 0 0 15px rgba(0, 0, 0, 1),
			 0 0 30px rgba(255, 255, 255, 0.9);
	}

	/* Dramatischer Click-Effekt */
	.level-button:active {
		transform: translate(-50%, -50%) scale(1.1);
		transition: all 0.1s ease;
	}

	.level-button:active .level-number-only {
		transform: scale(0.98);
		box-shadow: 
			0 4px 12px rgba(0, 0, 0, 0.4),
			inset 0 2px 0 rgba(255, 255, 255, 0.4),
			inset 0 -2px 0 rgba(0, 0, 0, 0.5);
	}

	/* Development Helper */
	.mouse-coords {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		font-family: 'Courier New', monospace;
		font-size: 11px;
		color: #555;
		background: rgba(255, 255, 255, 0.95);
		padding: 6px 12px;
		border-radius: 6px;
		white-space: nowrap;
		border: 1px solid #ddd;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.map-header-overlay {
			top: 15px;
			padding: 1rem 2rem;
			border-radius: 15px;
		}
		
		.level-button {
			padding: 3px;
		}
	}

	@media (max-width: 480px) {
		.map-header-overlay {
			top: 10px;
			padding: 0.8rem 1.5rem;
			border-radius: 12px;
			left: 10px;
			right: 10px;
			transform: none;
			width: calc(100% - 20px);
			box-sizing: border-box;
		}
		
		.level-button {
			padding: 2px;
		}
	}

	/* Large Screens */
	@media (min-width: 1400px) {
		.map-header-overlay {
			top: 30px;
			padding: 2rem 3rem;
			border-radius: 25px;
		}
	}

	/* Print Styles */
	@media print {
		.mouse-coords {
			display: none;
		}
	}
</style>