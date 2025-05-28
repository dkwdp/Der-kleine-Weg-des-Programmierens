<script>
	let mouseX = 0;
	let mouseY = 0;

	function handleMouseMove(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		mouseX = ((event.clientX - rect.left) / rect.width * 100).toFixed(2);
		mouseY = ((event.clientY - rect.top) / rect.height * 100).toFixed(2);
	}
</script>


<style>

.map-header {
	text-align: center;
	margin-bottom: 2vw;
}

.background {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(191, 215, 181, 0.8);
}

.map-container {
	position: relative;
	width: 100%;
	max-width: 1000px;
	margin: 0 auto;
}

.map-image {
	width: 100%;
	height: auto;
	display: block;
}

.level-button {
	position: absolute;
	aspect-ratio: 1 / 1;
	width: 3.5%; /* kleinerer Button */
	font-size: 1.5vw; /* kleinere Schrift, skaliert mit */
	background-color: rgba(255, 255, 255, 0.9);
	border: 0.230vw solid #555;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;

	box-shadow: 0 0.3vw 0.6vw rgba(0, 0, 0, 0.25); /* Schatten */
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	user-select: none;
}

.level-button:hover {
	transform: scale(1.2); /* beim Hover vergrößert */
	box-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.35);
	background-color: #f8f8f8;
}

.level-button.active {
	background-color: #ffd700;
	border-color: #c8a200;
	color: #222;
	font-weight: bold;
}



	/* Beispielpositionen */
	#level1 { top: 76.45%; left: 15.89%; }
	#level2 { top: 74.90%; left: 43.35%; }
	#level3 { top: 75.10%; left: 72.90%; }
	#level4 { top: 55.90%; left: 46.90%; }
	#level5 { top: 47.39%; left: 73.40%; }
	#level6 { top: 42.20%; left: 45.30%; }
	#level7 { top: 39.5%; left: 15.40%; }
	#level8 { top: 21.20%; left: 11.0%; }
	#level9 { top: 22.95%; left: 38.70%; }
	#level10 { top: 31.0%; left: 70.0%; }

.mouse-coords {
	margin-top: 20px;
	font-family: monospace;
}



.map-header h1 {
	font-size: 2vw;
	color: #333;
	margin-bottom: 0.5vw;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.map-header p {
	font-size: 1.2vw;
	color: #666;
	margin:0;
}

</style>

<div class="map-header">
	<h1>Willkommen im Abenteuerpfad!</h1>
	<p>Wähle ein Level aus, um deine Reise zu beginnen.</p>
</div>

<div class="background">
	<div class="map-container" role="presentation" on:mousemove={handleMouseMove}>

		<img src="/map.png" alt="Map" class="map-image" />
		
		<a id="level1" class="level-button active" href="/level1">1</a>
		<a id="level2" class="level-button active" href="/level2">2</a>
		<a id="level3" class="level-button active" href="/level3">3</a>
		<a id="level4" class="level-button active" href="/level4">4</a>
		<a id="level5" class="level-button active" href="/level5">5</a>
		<a id="level6" class="level-button active" href="/level6">6</a>
		<a id="level7" class="level-button active" href="/level7">7</a>
		<a id="level8" class="level-button active" href="/level8">8</a>
		<a id="level9" class="level-button active" href="/level9">9</a>
		<a id="level10" class="level-button active" href="/level10">10</a>
	</div>
</div>

<!-- Mauskoordinaten anzeigen -->
<div class="mouse-coords">
	Mausposition relativ zum Bild: X = {mouseX}%, Y = {mouseY}%
</div>



