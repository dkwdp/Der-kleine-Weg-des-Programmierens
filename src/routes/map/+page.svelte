<script>
	import { goto } from '$app/navigation';
	import { gameMode, unlockedLevels, bonusLevelsUnlocked } from '$lib/stores/editorStore';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Mascot from '../mascot/Mascot.svelte';
	
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

	const bonusLevelData = [
		{ id: 1, x: 50, y: 42, icon: '⚙️', name: 'Bonus 1', unlockAfter: 3, route: '/levels/bonusLevel/bonus1'}
	];

	// Messages
	const welcomeMessages = [
		'Yo, wieder da! 🐧',
		'Bock zu coden?',
		'Chillig hier, oder? Los geht\'s!',
		'Coding-Zeit! Bereit?',
		'Eis to see you! 🧊',
		'Hi',
		'Willkommen beim Coder-Dojo!'
	];

	const idleMessages = [
		'Chillst du noch oder codest du schon? 🐧',
		'Die Level warten auf dich!',
		'Watschel watschel... langweilig hier! 😴',
		'Flossen bereit? Lass uns eintauchen!',
		'Rutsch ins Coden wie ein Pinguin! 🧊',
		'Kein Stress, lass dir Zeit!',
		'Watschel rüber und wähl ein Level!',
		'Fisch später, coden jetzt! 🐟'
	];

	const hoverMessages = [
		'braucht deine Skills!',
		'sieht chill aus! 🧊',
		'braucht deine Pinguin-Power!',
		'sieht genial aus!',
		'wartet auf Rutschpartie!',
		'ist bereit!',
		'braucht uns! ✨'
	];

	const bonusHoverMessages = [
		'ist ein geheimes Abenteuer! ✨',
		'ist voller Überraschungen!',
		'ist bereit für Action! 💫',
		'ist ein Bonus-Level'
	];

	// Mascot Status
	let emotion = 'neutral';
	let message = 'Willkommen!';
	let inactivityTimer;
	let currentNeutralState = 'neutral';
	let iconLoadStates = {};
	
	// automatische Path Lines zwischen den Leveln
	const pathLines = [];
	for (let i = 0; i < levelData.length - 1; i++) {
		pathLines.push({
			x1: levelData[i].x, 	// aktuelles Level
			y1: levelData[i].y,
			x2: levelData[i + 1].x, // Nächstes Level
			y2: levelData[i + 1].y
		});
	}

	// -- Helper-Funktionen --
	// checkt, ob Level freigeschaltet sind
	function isLevelUnlocked(levelId) {
		return $gameMode === 'free' || $unlockedLevels.includes(levelId);
	}

	// checkt, welche Bonus-Level freigeschaltet sind
	function isBonusLevelUnlocked(bonusId) {
		return $gameMode === 'free' || $bonusLevelsUnlocked.includes(bonusId);
	}

	// Hilfsfunktionen für Messages
	function getRandomMessage(messageArray) {
		return messageArray[Math.floor(Math.random() * messageArray.length)];
	}

	function getRandomIdleMessage() {
		return getRandomMessage(idleMessages);
	}

	function getWelcomeMessage() {
		return getRandomMessage(welcomeMessages);
	}

	// resetted Inaktivitätstimer, wenn man z.B. über Level hovert
	function updateMascot(newEmotion, newMessage) {
		emotion = newEmotion;
		message = newMessage;
		resetInactivityTimer();
	}

	// Idle-Pinu: Wechselt zwischen neutral-Posen wenn User 10s nichts macht
	function resetInactivityTimer() {
		clearTimeout(inactivityTimer);
		inactivityTimer = setTimeout(() => {
			if (emotion === 'neutral' || emotion === 'neutral2' || emotion === 'think') {
				currentNeutralState = currentNeutralState === 'neutral' ? 'neutral2' : 'neutral';
				updateMascot(currentNeutralState, getRandomIdleMessage());
			}
		}, 10000);
	}

	// Icons Fall Back System: error
	function handleIconError(levelId) {
		iconLoadStates[levelId] = false;
		iconLoadStates = { ...iconLoadStates };
	}

	// Icons Fall Back System: success
	function handleIconLoad(levelId) {
		iconLoadStates[levelId] = true;
		iconLoadStates = { ...iconLoadStates }; 
	}
	
	function LevelJoin(levelId) {
		// Speichere das besuchte Level (nur valide Level-IDs) für AutoScroll
		if (browser && levelId && typeof levelId === 'number' && levelId >= 1 && levelId <= 10) {
			sessionStorage.setItem('lastVisitedLevel', levelId.toString());
		}
		//Navigation mit Delay
		setTimeout(() => {
			goto(`/levels/level${levelId}`);
		}, 200);
	}

	function BonusLevelJoin(bonusLevel) {
		setTimeout(() => {
			goto(bonusLevel.route);
		}, 200);
	}

	// Level Hover für Maskottchen Message
	function onLevelHover(level) {		
		const hoverMessage = getRandomMessage(hoverMessages);
		updateMascot('think', `Level ${level.id} ${hoverMessage}`);
	}

	// Bonus-Level Hover für Maskottchen Message
	function onBonusLevelHover(bonusLevel) {
		const hoverMessage = getRandomMessage(bonusHoverMessages);
		updateMascot('think', `${bonusLevel.name} ${hoverMessage}`);
	}
	
	onMount(() => {
		// Maskottchen Initialisierung
		const welcomeMsg = getWelcomeMessage();
		emotion = 'neutral';
		message = welcomeMsg;
		resetInactivityTimer();

		// Autoscroll zum letzten oder höchsten freigeschalteten Level
		setTimeout(() => {
			let targetLevel;
			
			// schaut woher der User kommt
			const lastVisitedLevel = browser ? sessionStorage.getItem('lastVisitedLevel') : null;
			const cameFromLevel = $page.url.searchParams.get('from') || lastVisitedLevel;
			
			// String zu Zahl konvertieren
			const parsedLevel = cameFromLevel ? parseInt(cameFromLevel, 10) : null;
			
			if (parsedLevel && !isNaN(parsedLevel) && isLevelUnlocked(parsedLevel)) {
				targetLevel = parsedLevel;
				if (browser) sessionStorage.removeItem('lastVisitedLevel');
			} else {
				targetLevel = $unlockedLevels.length === 0 ? 1 : Math.max(...$unlockedLevels);
			}
			
			const levelButton = document.querySelector(`[data-level="${targetLevel}"]`);
			if (levelButton) {
				levelButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		}, 50);
	});

	onDestroy(() => {
		clearTimeout(inactivityTimer);
	});
</script>

<Mascot {emotion} {message} />

<div class="page-container">
	<div class="map-container">
		<img src="/map.png" alt="Adventure Map" class="map-image" />
		
		<!-- Schnee-Animation -->
		<div class="snowflakes" aria-hidden="true">
			{#each Array(15) as _, i}
				<div class="snowflake">
					{['❅', '❆', '❄', '❅', '❆'][i % 5]}
				</div>
			{/each}
		</div>
		
		<div class="map-header-overlay">
			<h1>Willkommen im Coder-Dojo Abenteuerpfad!</h1>
		</div>

		<!-- Progress Widget -->
		{#if $gameMode === 'progressive'}
			<div class="progress-widget">
				<span class="progress-text">{$unlockedLevels.length}/10 Level freigeschaltet</span>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {($unlockedLevels.length / 10) * 100}%"></div>
				</div>
				<!-- Bonus Progress -->
				{#if $bonusLevelsUnlocked.length > 0}
					<span class="bonus-progress-text">✨ {$bonusLevelsUnlocked.length}/1 Bonus entdeckt</span>
				{/if}
			</div>
		{/if}

		<!-- Path Lines -->
		<svg class="path-lines-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
			{#each pathLines as line}
				<line 
					x1="{line.x1}%" 
					y1="{line.y1}%" 
					x2="{line.x2}%" 
					y2="{line.y2}" 
					stroke="rgba(160, 160, 160, 0.3)"
					stroke-width="0.3"
					stroke-dasharray="1,0.5"
				/>
			{/each}
		</svg>
		
		<button 
			class="home-button"
			on:click={() => goto('/')}
			title="Zurück zur Startseite"
		>
			🏠 Home
		</button>
		
		<!-- Level System -->
		{#each levelData as level}
			<button 
				class="level-button {level.size} {isLevelUnlocked(level.id) ? 'unlocked' : 'locked'}"
				style="top: {level.y}%; left: {level.x}%;"
				data-level="{level.id}"
				on:click={() => LevelJoin(level.id)}
				on:mouseenter={() => onLevelHover(level)}
				title="{level.name}"
				disabled={!isLevelUnlocked(level.id)}
			>
				<!-- Icon Fallback System -->
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

		{#each bonusLevelData as bonusLevel}
			{#if isBonusLevelUnlocked(bonusLevel.id)}
				<button 
					class="bonus-level-button"
					style="top: {bonusLevel.y}%; left: {bonusLevel.x}%;"
					data-bonus-level="{bonusLevel.id}"
					on:click={() => BonusLevelJoin(bonusLevel)}
					on:mouseenter={() => onBonusLevelHover(bonusLevel)}
					title="{bonusLevel.name}"
				>
					<div class="bonus-icon">
						{bonusLevel.icon}
					</div>
					<div class="bonus-glow"></div>
				</button>
			{/if}
		{/each}
	</div>
</div>

<style>
	/* Css Variablen */
	:root {
		--shadow-light: 0 4px 15px rgba(0, 0, 0, 0.2);
		--shadow-medium: 0 8px 25px rgba(0, 0, 0, 0.4);
		--shadow-heavy: 0 15px 40px rgba(0, 0, 0, 0.6);
		--transition-smooth: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		--transition-quick: all 0.1s ease;
		--glass-bg: rgba(255, 255, 255, 0.3);
		--glass-border: 1px solid rgba(255, 255, 255, 0.15);
		--text-outline: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 3px rgba(0, 0, 0, 1);
		--bonus-gold: #d4af37;
	}

	:global(html, body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		overscroll-behavior: none;
	}

	.snowflakes {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 12;
		overflow: hidden; 
	}

	.snowflake {
		position: absolute;
		top: -10%;
		color: #fff;
		font-family: Arial;
		text-shadow: 0 0 1px #000;
		user-select: none;
		cursor: default;
		animation: snowfall 35s linear infinite, snowshake 6s ease-in-out infinite;
	}

	@keyframes snowfall {
		0% { top: -10%; opacity: 0; }
		5% { opacity: 1; }
		95% { opacity: 1; }
		100% { top: 100%; opacity: 0; }
	}

	@keyframes snowshake {
		0%, 100% { transform: translateX(0px) rotate(0deg); }
		25% { transform: translateX(30px) rotate(90deg); }
		50% { transform: translateX(-20px) rotate(180deg); }
		75% { transform: translateX(40px) rotate(270deg); }
	}

	/* Chaotische Schneeflocken - verschiedene Größen, Positionen und Timing */
	.snowflake:nth-child(1) { left: 8%; font-size: 0.8em; animation-delay: 0s, 1.2s; }
	.snowflake:nth-child(2) { left: 23%; font-size: 1.3em; animation-delay: 3s, 0.5s; }
	.snowflake:nth-child(3) { left: 67%; font-size: 0.9em; animation-delay: 7s, 2.8s; }
	.snowflake:nth-child(4) { left: 41%; font-size: 1.1em; animation-delay: 12s, 0.3s; }
	.snowflake:nth-child(5) { left: 89%; font-size: 0.7em; animation-delay: 2s, 4.1s; }
	.snowflake:nth-child(6) { left: 15%; font-size: 1.4em; animation-delay: 18s, 1.7s; }
	.snowflake:nth-child(7) { left: 56%; font-size: 0.6em; animation-delay: 5s, 3.2s; }
	.snowflake:nth-child(8) { left: 78%; font-size: 1.2em; animation-delay: 25s, 0.8s; }
	.snowflake:nth-child(9) { left: 34%; font-size: 0.9em; animation-delay: 9s, 2.1s; }
	.snowflake:nth-child(10) { left: 92%; font-size: 0.8em; animation-delay: 14s, 4.5s; }
	.snowflake:nth-child(11) { left: 19%; font-size: 1.5em; animation-delay: 21s, 1.1s; }
	.snowflake:nth-child(12) { left: 73%; font-size: 0.7em; animation-delay: 1s, 3.7s; }
	.snowflake:nth-child(13) { left: 45%; font-size: 1.0em; animation-delay: 16s, 0.9s; }
	.snowflake:nth-child(14) { left: 61%; font-size: 0.5em; animation-delay: 29s, 2.4s; }
	.snowflake:nth-child(15) { left: 27%; font-size: 1.3em; animation-delay: 8s, 1.6s; }

	/* ===== MAP LAYOUT ===== */
	.map-container {
		position: relative;
	}

	.map-image {
		width: 100%;
		display: block;
	}

	.map-header-overlay {
		position: absolute;
		top: 30px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		backdrop-filter: blur(10px);
		border-radius: 20px;
		padding: 1.5rem 2.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
		z-index: 25; /* Über Schneeflocken */
	}

	.map-header-overlay h1 {
		font-size: clamp(1.5rem, 3.5vw, 2.2rem);
		color: #2c3e50;
		margin: 0;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	/* ===== PROGRESS WIDGET ===== */
	.progress-widget {
		position: fixed;
		bottom: 105px;
		left: 40px;
		padding: 1rem;
		backdrop-filter: blur(8px);
		border: var(--glass-border);
		border-radius: 15px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		z-index: 20;
	}

	.progress-text, .bonus-progress-text {
		font-weight: 600;
		padding: 0.3rem 0.8rem;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.4);
		text-align: center;
	}

	.progress-text {
		font-size: 0.9rem;
		color: #000000;
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.4);
	}

	.bonus-progress-text {
		font-size: 0.8rem;
		color: var(--bonus-gold);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		background: rgba(212, 175, 55, 0.2);
		border-color: rgba(212, 175, 55, 0.4);
	}

	.progress-bar {
		width: 190px;
		height: 10px;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #27ae60 0%, #2ecc71 100%);
		border-radius: 4px;
	}

	/* ===== PATH LINES ===== */
	.path-lines-svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	/* ===== GEMEINSAME BUTTON STYLES ===== */
	.level-button, .bonus-level-button {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: transparent;
		border: none;
		cursor: pointer;
		user-select: none;
		transition: var(--transition-smooth);
	}

	.level-button {
		filter: var(--shadow-medium);
		z-index: 10;
	}

	.bonus-level-button {
		display: flex;
		align-items: center;
		z-index: 15;
		filter: drop-shadow(0 6px 20px rgba(212, 175, 55, 0.6));
		transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	/* ===== LEVEL BUTTON SIZES ===== */
	.level-button.large {
		width: clamp(180px, 20vw, 400px);
		height: clamp(180px, 20vw, 400px);
		filter: var(--shadow-heavy);
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

	/* ===== BUTTON STATES ===== */
	.level-button.locked {
		filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2)) grayscale(100%) brightness(0.5);
		cursor: not-allowed;
		pointer-events: none;
	}

	.level-button.unlocked:hover, .bonus-level-button:hover {
		transform: translate(-50%, -50%) scale(1.05);
	}

	.level-button.unlocked:hover {
		filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.5));
	}

	.bonus-level-button:hover {
		transform: translate(-50%, -50%) scale(1.15);
		filter: drop-shadow(0 8px 25px rgba(212, 175, 55, 0.8));
	}

	.level-button.unlocked:active, .bonus-level-button:active {
		transition: var(--transition-quick);
	}

	.level-button.unlocked:active {
		transform: translate(-50%, -50%) scale(1.15);
	}

	.bonus-level-button:active {
		transform: translate(-50%, -50%) scale(1.25);
	}

	/* ===== LEVEL ICONS & OVERLAYS ===== */
	.level-icon {
		width: 100%;
		height: 100%;
		object-fit: contain;
		transition: var(--transition-smooth);
	}

	.level-number-overlay, .lock-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		pointer-events: none;
	}

	.level-number-overlay {
		transform: translate(-50%, -50%);
		font-size: clamp(10px, 1.5vw, 16px);
		color: white;
		font-family: 'Arial Black', sans-serif;
		text-shadow: var(--text-outline);
		z-index: 1;
		transition: var(--transition-smooth);
	}

	.lock-overlay {
		transform: translate(-50%, -63%);
		font-size: clamp(20px, 2vw, 40px);
		z-index: 2;
	}

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
		transition: var(--transition-smooth);
	}

	/* SIZE-SPECIFIC FONT SIZES */
	.level-button.large .level-number-only { font-size: clamp(24px, 4vw, 45px); }
	.level-button.medium .level-number-only { font-size: clamp(20px, 3vw, 32px); }
	.level-button.small .level-number-only { font-size: clamp(16px, 2.5vw, 24px); }

	/* ===== BONUS LEVEL STYLES ===== */
	.bonus-icon {
		font-size: clamp(24px, 3vw, 48px);
		z-index: 2;
		animation: bonusPulse 2s ease-in-out infinite;
	}

	.bonus-glow {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 120%;
		height: 120%;
		background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
		border-radius: 50%;
		animation: bonusGlow 3s ease-in-out infinite;
		z-index: 1;
	}

	/* BONUS ANIMATIONS */
	@keyframes bonusPulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.1); }
	}

	@keyframes bonusGlow {
		0%, 100% { 
			opacity: 0.5; 
			transform: translate(-50%, -50%) scale(1);
		}
		50% { 
			opacity: 0.8; 
			transform: translate(-50%, -50%) scale(1.2);
		}
	}

	.bonus-level-button:hover .bonus-icon { animation-duration: 1s; }
	.bonus-level-button:hover .bonus-glow { animation-duration: 1.5s; }

	/* ===== HOME BUTTON ===== */
	.home-button {
		position: fixed;
		bottom: 40px;
		left: 40px;
		width: 225px;
		color: white;
		border-radius: 25px;
		font-size: 16px;
		font-weight: 600;
		background: var(--glass-bg);
		border: 3px solid rgba(255, 255, 255, 0.2);
		padding: 0.6rem;
		z-index: 20;
		transition: var(--transition-smooth);
	}

	.home-button:hover {
		transform: translateY(-5px);
		box-shadow: 0 6px 20px rgba(52, 152, 219, 0.1);
	}

	.home-button:active {
		transform: translateY(0);
		box-shadow: 0 2px 10px rgba(52, 152, 219, 0.3);
	}
</style>