<script>
	import { goto } from '$app/navigation';
	import { gameMode, unlockedLevels, bonusLevelsUnlocked } from '$lib/stores/editorStore';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import Mascot from '../mascot/Mascot.svelte';

	// Mascot State Management
	let emotion = 'neutral';
	let message = 'Willkommen!';
	let inactivityTimer;
	let currentNeutralState = 'neutral';
	
	// Level-Daten (bestehend)
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
		{ 
			id: 1, 
			x: 50, 
			y: 42, 
			icon: '⚙️', 
			name: 'Bonus 1', 
			description: 'Canvas-Programmierung',
			unlockAfter: 3,
			route: '/levels/bonusLevel/bonus1'
		},
		{ 
			id: 2, 
			x: 59, 
			y: 65, 
			icon: '⚙️', 
			name: 'Bonus 2', 
			description: 'Programmiere den Roboter',
			unlockAfter: 6,
			route: '/levels/bonusLevel/bonus2'
		},
		{ 
			id: 3, 
			x: 45, 
			y: 87.5, 
			icon: '⚙️', 
			name: 'Bonus 3', 
			description: 'For- und While-Schleifen meistern',
			unlockAfter: 8,
			route: '/levels/bonusLevel/bonus3'
		},
		{ 
			id: 4, 
			x: 55, 
			y: 92.5, 
			icon: '⚙️', 
			name: 'Bonus 4', 
			description: 'If/Else',
			unlockAfter: 9,
			route: '/levels/bonusLevel/bonus4'
		}
	];

	let iconLoadStates = {};

	function isLevelUnlocked(levelId) {
		return $gameMode === 'free' || $unlockedLevels.includes(levelId);
	}

	function isBonusLevelUnlocked(bonusId) {
    return $bonusLevelsUnlocked.includes(bonusId);
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
		'Eis-kalte Coding-Skills kommen!',
		'Rutsch ins Coden wie ein Pinguin! 🧊',
		'Kein Stress, lass dir Zeit!',
		'Watschel rüber und wähl ein Level!',
		'Fisch später, coden jetzt! 🐟'
	];

	const hoverMessages = [
		'braucht deine Skills!',
		'sieht chill aus! 🧊',
		'ist bereit für Fisch-Action! 🐟',
		'braucht deine Pinguin-Power!',
		'sieht eis-genial aus!',
		'wartet auf die Rutschpartie!',
		'ist bereit!',
		'braucht Pinguin-Magie! ✨'
	];

	const bonusHoverMessages = [
		'ist ein geheimes Abenteuer! ✨',
		'ist voller Überraschungen!',
		'ist bereit für Bonus-Action! 💫',
		'ist ein Bonus-Level'
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

	function LevelJoin(levelId) {
	// Speichere das besuchte Level (nur valide Level-IDs)
	if (browser && levelId && typeof levelId === 'number' && levelId >= 1 && levelId <= 10) {
		sessionStorage.setItem('lastVisitedLevel', levelId.toString());
	}
	
		setTimeout(() => {
        	goto(`/levels/level${levelId}`);
    	}, 200);
	}

	function BonusLevelJoin(bonusLevel) {
		setTimeout(() => {
        	goto(bonusLevel.route);
    	}, 200);
	}

	function onLevelHover(level) {		
		const hoverMessage = getRandomMessage(hoverMessages);
		updateMascot('think', `Level ${level.id} ${hoverMessage}`);
	}

	function onBonusLevelHover(bonusLevel) {
		const hoverMessage = getRandomMessage(bonusHoverMessages);
		updateMascot('think', `${bonusLevel.name} ${hoverMessage}`);
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
	onMount(() => {
		const welcomeMsg = getWelcomeMessage();
		emotion = 'neutral';
		message = welcomeMsg;
		resetInactivityTimer();

		// Auto-Scroll - nur wenn Level nicht sichtbar ist
		setTimeout(() => {
			let targetLevel;
			
			const lastVisitedLevel = browser ? sessionStorage.getItem('lastVisitedLevel') : null;
			const cameFromLevel = $page.url.searchParams.get('from') || lastVisitedLevel;
			
			const parsedLevel = cameFromLevel ? parseInt(cameFromLevel, 10) : null;
			
			if (parsedLevel && !isNaN(parsedLevel) && isLevelUnlocked(parsedLevel)) {
				targetLevel = parsedLevel;
				if (browser) sessionStorage.removeItem('lastVisitedLevel');
			} else {
				if ($unlockedLevels.length === 0) {
					targetLevel = 1;
				} else {
					targetLevel = Math.max(...$unlockedLevels);
				}
			}
			
			setTimeout(() => {
				const levelButton = document.querySelector(`[data-level="${targetLevel}"]`);
				if (levelButton) {
					try {
						const rect = levelButton.getBoundingClientRect();
						const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight && 
										rect.left >= 0 && rect.right <= window.innerWidth;
						
						if (!isVisible) {
							levelButton.scrollIntoView({ 
								behavior: 'smooth', 
								block: 'center' 
							});
						}
					} catch (error) {
						console.warn('Auto-scroll error:', error);
						levelButton.scrollIntoView({ 
							behavior: 'smooth', 
							block: 'center' 
						});
					}
				}
			}, 200);
		}, 100);
	});

	onDestroy(() => {
		clearTimeout(inactivityTimer);
	});
</script>

<Mascot {emotion} {message} />

<div class="page-container">
	<div class="map-container">
		<img src="/map.png" alt="Adventure Map" class="map-image" />
		
		<div class="map-header-overlay">
			<h1>Willkommen im Coder-Dojo Abenteuerpfad!</h1>
		</div>

		<!-- Progress Widget erweitert -->
		{#if $gameMode === 'progressive'}
			<div class="progress-widget">
				<span class="progress-text">{$unlockedLevels.length}/10 Level freigeschaltet</span>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {($unlockedLevels.length / 10) * 100}%"></div>
				</div>
				<!-- BONUS PROGRESS -->
				{#if $bonusLevelsUnlocked.length > 0}
					<span class="bonus-progress-text">✨ {$bonusLevelsUnlocked.length}/4 Bonus entdeckt</span>
				{/if}
			</div>
		{/if}

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

		{#each levelData as level}
			<button 
				class="level-button {level.size} {isLevelUnlocked(level.id) ? 'unlocked' : 'locked'}"
				style="top: {level.y}%; left: {level.x}%;"
				data-level="{level.id}"
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

		{#each bonusLevelData as bonusLevel}
			{#if isBonusLevelUnlocked(bonusLevel.id)}
				<button 
					class="bonus-level-button"
					style="top: {bonusLevel.y}%; left: {bonusLevel.x}%;"
					data-bonus-level="{bonusLevel.id}"
					on:click={() => BonusLevelJoin(bonusLevel)}
					on:mouseenter={() => onBonusLevelHover(bonusLevel)}
					on:mouseleave={onLevelLeave}
					title="{bonusLevel.name} - {bonusLevel.description}"
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
	:global(html, body) {
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
		overflow: auto;
		overscroll-behavior: none;
	}

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
		top: 30px;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		z-index: 100;
		pointer-events: none;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		padding: 1.5rem 2.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
	}

	.map-header-overlay h1 {
		font-size: clamp(1.5rem, 3.5vw, 2.2rem);
		color: #2c3e50;
		margin: 0;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.progress-widget {
		position: fixed;
		bottom: 105px;
		left: 40px;
		pointer-events: none;
		padding: 1rem 1rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(8px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 15px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		z-index: 20;
	}

	.progress-text {
		font-size: 0.9rem;
		color: #000000;
		font-weight: 600;
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.4);
		padding: 0.3rem 0.8rem;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.4);
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

	.bonus-progress-text {
		font-size: 0.8rem;
		color: #d4af37;
		font-weight: 600;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		background: rgba(212, 175, 55, 0.2);
		padding: 0.2rem 0.6rem;
		border-radius: 10px;
		border: 1px solid rgba(212, 175, 55, 0.4);
		text-align: center;
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

	.bonus-level-button {
		position: absolute;
		transform: translate(-50%, -50%);
		background: transparent;
		border: none;
		width: clamp(50px, 6vw, 100px);
		height: clamp(50px, 6vw, 100px);
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		user-select: none;
		z-index: 15;
		filter: drop-shadow(0 6px 20px rgba(212, 175, 55, 0.6));
	}

	.bonus-icon {
		font-size: clamp(24px, 3vw, 48px);
		z-index: 2;
		position: relative;
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

	.bonus-level-button:hover {
		transform: translate(-50%, -50%) scale(1.15);
		filter: drop-shadow(0 8px 25px rgba(212, 175, 55, 0.8));
	}

	.bonus-level-button:hover .bonus-icon {
		animation-duration: 1s;
	}

	.bonus-level-button:hover .bonus-glow {
		animation-duration: 1.5s;
	}

	.bonus-level-button:active {
		transform: translate(-50%, -50%) scale(1.25);
		transition: all 0.1s ease;
	}

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

	.level-button.locked {
		filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2)) grayscale(100%) brightness(0.5);
		cursor: not-allowed;
		pointer-events: none;
	}

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
		text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 3px rgba(0, 0, 0, 1);
		pointer-events: none;
		z-index: 1;
		transition: all 0.3s ease;
	}

	.lock-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -63%);
		font-size: clamp(20px, 2vw, 40px);
		z-index: 2;
		pointer-events: none;
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

	.level-button.unlocked:hover {
		transform: translate(-50%, -50%) scale(1.05);
		filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.5));
	}

	.level-button.unlocked:active {
		transform: translate(-50%, -50%) scale(1.15);
		transition: all 0.1s ease;
	}

	.home-button {
		position: fixed;
		bottom: 40px;
		left: 40px;
		width: 225px;
		color: white;
		border-radius: 25px;
		font-size: 16px;
		font-weight: 600;
		transition: all 0.3s ease;
		background: rgba(255, 255, 255, 0.3);
		border: 3px solid rgba(255, 255, 255, 0.2);
		padding: 0.6rem;
		z-index: 20;
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