<script>
	import { goto } from '$app/navigation';
	import { gameMode, unlockedLevels } from '$lib/stores/editorStore';
	import Mascot from '../mascot/Mascot.svelte';

	// Mascot State Management
	let emotion = 'neutral';
	let message = 'Willkommen!';
	let inactivityTimer;
	let currentNeutralState = 'neutral';
	
	// Level-Daten
	const levelData = [
		{ id: 1, x: 60, y: 12, icon: 'polarbear', name: 'Polarbaer', size: 'medium' },
		{ id: 2, x: 22, y: 22, icon: 'tent', name: 'Zelt', size: 'medium' },
		{ id: 3, x: 30, y: 42, icon: 'hut', name: 'Huette', size: 'large' },
		{ id: 4, x: 63, y: 42, icon: 'angler', name: 'Angler', size: 'small' },
		{ id: 5, x: 49, y: 53, icon: 'bridge', name: 'Bruecke', size: 'large' },
		{ id: 6, x: 70, y: 57, icon: 'lumberjack', name: 'Holzfaeller', size: 'small' },
		{ id: 7, x: 48, y: 73, icon: 'raft', name: 'Floß', size: 'medium' },
		{ id: 8, x: 20, y: 85, icon: 'kid', name: 'Kind', size: 'small' },
		{ id: 9, x: 70, y: 90, icon: 'flower', name: 'Blume', size: 'small' },
		{ id: 10, x: 43, y: 95, icon: 'fish', name: 'Fisch', size: 'small' },
	];

	let iconLoadStates = {};

	function isLevelUnlocked(levelId) {
		return $gameMode === 'free' || $unlockedLevels.includes(levelId);
	}

	// Maskottchen
	function updateMascot(newEmotion, newMessage) {
		emotion = newEmotion;
		message = newMessage;
		resetInactivityTimer();
	}

	function resetInactivityTimer() {
		clearTimeout(inactivityTimer);
		inactivityTimer = setTimeout(() => {
			if (emotion === 'neutral' || emotion === 'neutral2') {
				currentNeutralState = currentNeutralState === 'neutral' ? 'neutral2' : 'neutral';
				updateMascot(currentNeutralState, getRandomIdleMessage());
			}
		}, 7000);
	}

	// Message Arrays
	const welcomeMessages = [
		'Yo, wieder da! 🐧',
		'Pingu ist zurück! Bock zu coden?',
		'Chillig hier, oder? Los geht\'s!',
		'Watschel-Zeit! Bereit für Code-Magie?',
		'Eis to see you! 🧊',
		'Pinguin-Power aktiviert!'
	];

	const idleMessages = [
		'Chillst du noch oder codest du schon? 🐧',
		'Pssst... die Level warten auf dich!',
		'Watschel watschel... langweilig hier! 😴',
		'Eisbär-Modus: entspannt warten...',
		'Flossen bereit? Lass uns eintauchen!',
		'Eis-kalte Coding-Skills kommen!',
		'Flossen-Tipp: Einfach mal klicken!',
		'Rutsch ins Coden wie ein Pinguin! 🧊',
		'Kein Stress, jeder fängt mal an!',
		'Coolness-Level: Pinguin! ❄️',
		'Watschel rüber und wähl ein Level!',
		'Fisch später, coden jetzt! 🐟'
	];

	const hoverMessages = [
		'ist eis-oliert und wartet!',
		'braucht deine Flossen-Skills!',
		'sieht chill aus! 🧊',
		'wartet auf deinen Watschel!',
		'ist bereit für Fisch-Action! 🐟',
		'braucht deine Pinguin-Power!',
		'sieht eis-genial aus!',
		'wartet auf die Rutschpartie!',
		'ist flossen-bereit!',
		'braucht Pinguin-Magie! ✨'
	];

	const lockedMessages = [
		'ist noch eingefroren! 🧊',
		'wartet auf das Auftauen!',
		'ist noch nicht bereit!',
		'braucht mehr Pinguin-Power!',
		'ist noch im Eis gefangen!'
	];

	// Hilfsfunktionen
	function getRandomMessage(messageArray) {
		return messageArray[Math.floor(Math.random() * messageArray.length)];
	}

	function getRandomIdleMessage() {
		return getRandomMessage(idleMessages);
	}

	function getWelcomeMessage() {
		return getRandomMessage(welcomeMessages);
	}

	// Level Interaktion
	function LevelJoin(levelId) {
		if (!isLevelUnlocked(levelId)) {
			updateMascot('sad', `Level ${levelId} ${getRandomMessage(lockedMessages)}`);
			return;
		}
		
		const goMessages = [
			'Rutsch-Zeit! 🐧',
			'Auf geht\'s zum Watscheln!',
			'Eis to meet you, Level!',
			'Flossen-Action aktiviert!',
			'Lass uns eintauchen! 🌊'
		];
		updateMascot('switch', getRandomMessage(goMessages));
		
		setTimeout(() => {
			goto(`/levels/level${levelId}`);
		}, 800);
	}

	function onLevelHover(level) {
		if (!isLevelUnlocked(level.id)) {
			updateMascot('sad', `Level ${level.id} ${getRandomMessage(lockedMessages)}`);
			return;
		}
		
		const hoverMessage = getRandomMessage(hoverMessages);
		updateMascot('think', `Level ${level.id} ${hoverMessage}`);
	}

	function onLevelLeave() {
		const leaveMessages = [
			'Watschel rum! 🐧',
			'Such dir dein Eis-Abenteuer!',
			'Wähl dein Coding-Schicksal!',
			'Flossen-Entscheidung steht an!'
		];
		updateMascot(currentNeutralState, getRandomMessage(leaveMessages));
	}

	// Path Linien
	function createPathLines() {
		let pathLines = [];
		for (let i = 0; i < levelData.length - 1; i++) {
			const currentLevel = levelData[i];
			const nextLevel = levelData[i + 1];
			
			pathLines.push({
				x1: currentLevel.x,
				y1: currentLevel.y,
				x2: nextLevel.x,
				y2: nextLevel.y,
				id: `path-${currentLevel.id}-${nextLevel.id}`
			});
		}
		return pathLines;
	}

	const pathLines = createPathLines();

	// Icons
	function handleIconError(levelId) {
		iconLoadStates[levelId] = false;
		iconLoadStates = { ...iconLoadStates };
	}

	function handleIconLoad(levelId) {
		iconLoadStates[levelId] = true;
		iconLoadStates = { ...iconLoadStates }; 
	}

	// Initialisierung
	import { onMount, onDestroy } from 'svelte';
	
	onMount(() => {
		const welcomeMsg = getWelcomeMessage();
		emotion = 'neutral';
		message = welcomeMsg;
		resetInactivityTimer();
	});

	onDestroy(() => {
		clearTimeout(inactivityTimer);
	});
</script>

<Mascot {emotion} {message} />

<div class="page-container">
	<div class="map-container" role="application">
		<img src="/map.png" alt="Adventure Map" class="map-image" />
		
		<div class="map-header-overlay">
			<h1>Willkommen im Coder-Dojo Abenteuerpfad!</h1>
		</div>

		<svg class="path-lines-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
			{#each pathLines as line}
				<line 
					x1="{line.x1}%" 
					y1="{line.y1}%" 
					x2="{line.x2}%" 
					y2="{line.y2}%" 
					class="path-line"
					stroke="rgba(160, 160, 160, 0.3)"
					stroke-width="0.3"
					stroke-dasharray="1,0.5"
				/>
			{/each}
		</svg>
		
		{#each levelData as level}
			<button 
				class="level-button {level.size} {isLevelUnlocked(level.id) ? 'unlocked' : 'locked'}"
				style="top: {level.y}%; left: {level.x}%;"
				on:click={() => LevelJoin(level.id)}
				on:mouseenter={() => onLevelHover(level)}
				on:mouseleave={onLevelLeave}
				title="{level.name}"
				disabled={!isLevelUnlocked(level.id)}
			>
				{#if iconLoadStates[level.id] === false}
					<div class="level-number-only">
						{level.id}
					</div>
				{:else}
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
				
				{#if !isLevelUnlocked(level.id)}
					<div class="lock-overlay">
						🔒
					</div>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	:global(html) {
		overflow: auto;
		overscroll-behavior: none; /* Verhindert Overscroll */
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* Internet Explorer 10+ */
	}

	:global(html::-webkit-scrollbar) {
		display: none; /* Webkit (Chrome, Safari) */
	}

	:global(body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		overflow: auto;
		overscroll-behavior: none; /* Verhindert Bounce-Effekt */
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* Internet Explorer 10+ */
	}
	
	:global(body::-webkit-scrollbar) {
		display: none; /* Webkit (Chrome, Safari) */
	}

	/* Auch für alle anderen Container */
	:global(*) {
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* Internet Explorer 10+ */
	}

	:global(*::-webkit-scrollbar) {
		display: none; /* Webkit (Chrome, Safari) */
	}

	/* Layout */
	.page-container {
		width: 100%;
		min-height: 100vh;
	}

	.map-container {
		position: relative;
		width: 100%;
		min-height: 100vh;
		min-width: 1200px;
	}

	.map-image {
		width: 100%;
		min-height: 100vh;
		object-fit: cover;
		display: block;
	}

	/* Header */
	.map-header-overlay {
		position: absolute;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		z-index: 100;
		pointer-events: none;
		
		/* Glasmorphism */
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

	/* Path Linien */
	.path-lines-svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	/* Level Buttons */
	.level-button {
		position: absolute;
		transform: translate(-50%, -50%);
		background: transparent;
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		padding: 2px;
		transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		user-select: none;
		filter: drop-shadow(0 8px 25px rgba(0, 0, 0, 0.4));
		z-index: 10;
	}

	/* Button Größen */
	.level-button.large {
		width: clamp(180px, 20vw, 400px);
		height: clamp(180px, 20vw, 400px);
		filter: drop-shadow(0 15px 40px rgba(0, 0, 0, 0.6));
	}

	.level-button.medium {
		width: clamp(120px, 12vw, 250px);
		height: clamp(120px, 12vw, 250px);
		filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
	}

	.level-button.small {
		width: clamp(80px, 8vw, 150px);
		height: clamp(80px, 8vw, 150px);
		filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.4));
	}

	/* Gesperrte Level */
	.level-button.locked {
		filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2)) grayscale(100%) brightness(0.5);
		cursor: not-allowed;
		pointer-events: none;
	}

	/* Level Icons */
	.level-icon {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: all 0.3s ease;
	}

	.level-number-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: clamp(10px, 1.5vw, 16px);
		color: white;
		font-family: 'Arial Black', sans-serif;
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

	.lock-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: clamp(20px, 3vw, 40px);
		z-index: 2;
		pointer-events: none;
	}

	/* Fallback Buttons */
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

	.level-button.large .level-number-only {
		font-size: clamp(24px, 4vw, 45px);
	}
	.level-button.medium .level-number-only {
		font-size: clamp(20px, 3vw, 32px);
	}
	.level-button.small .level-number-only {
		font-size: clamp(16px, 2.5vw, 24px);
	}

	/* Hover Effekte */
	.level-button.unlocked:hover {
		transform: translate(-50%, -50%) scale(1.05);
		filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.5));
	}

	.level-button.unlocked:active {
		transform: translate(-50%, -50%) scale(1.15);
		transition: all 0.1s ease;
	}
</style>