<script>
	import word_list from "./all_words"
	import words from "./words_list"

	let current = "";

	let letters = [0, 1, 2, 3, 4]
	let rows = [0, 1, 2, 3, 4, 5]

	let startDate = "2022-01-01";
	let date1 = new Date();
	let date2 = new Date(startDate);
	let timeInMilisec = date1.getTime() - date2.getTime();
	let daysBetweenDates = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));

	let word = words[daysBetweenDates]
	let current_guesses = []
	let current_guess = 0;

	let stop = false;
	let wrong = false;

	// localStorage.removeItem('stats')

	let save_data = JSON.parse(localStorage.getItem('stats')) == null ? {
		"1": "0",
		"2": "0",
		"3": "0",
		"4": "0",
		"5": "0",
		"6": "0",
		"last_played": "",
		"last_played_words": [],
		"last_played_guesses": ""
	} : JSON.parse(localStorage.getItem('stats'));

	let max_progess = (parseInt(save_data["1"]) + parseInt(save_data["2"]) + parseInt(save_data["3"]) + parseInt(save_data["4"]) + parseInt(save_data["5"])).toString()

	if(save_data["last_played"] == new Date().toDateString()) {
		current_guesses = save_data["last_played_words"];
		current_guess = save_data["last_played_guesses"];
		stop = true;
	}

	let counter = 0;
	const interval = setInterval(() => {!wrong ? counter = 0 : counter > 60 ? wrong = false : counter ++}, 1);
	const setTime = setInterval(() => {header_time = timeUntilMidnight()}, 1000);

	let header_time = "";

	// console.log(save_data)

	function timeUntilMidnight() {
		var midnight = new Date();
		midnight.setHours( 24 );
		midnight.setMinutes( 0 );
		midnight.setSeconds( 0 );
		midnight.setMilliseconds( 0 );
		var MINUTES = ( midnight.getTime() - new Date().getTime() ) / 1000 / 60;

		var m = MINUTES % 60;

		var h = (MINUTES-m)/60;

		var HHMM = h.toString() + ":" + (m<10?"0":"") + m.toString();
		return HHMM.split(".")[0].length == 4 ? "0" + HHMM.split(".")[0] : HHMM.split(".")[0];
	}

	document.onkeypress = function (event) {
		if(stop)
			return;

		let char = (typeof event !== 'undefined') ? event.keyCode : event.which
		if(current.length < 5 && char != 32 && char != 13 && char != 8)
			current += String.fromCharCode(char)
		current.replace(" ", "");
		current = current;
	}

	document.onkeydown = function() {
		var key = event.keyCode || event.charCode;
		// console.log(key)
		if(stop)
			return;

		if( key == 8 ){
			current = current.slice(0, -1);
		} else if(key == 13) {
			if(current.length == 5 && word_list.includes(current)) {
				current_guesses[current_guess] = current;
				current_guess ++;
				if(current == word) {
					stop = true;
					save_data["last_played"] = new Date().toDateString();
					save_data["last_played_words"] = current_guesses;
					save_data["last_played_guesses"] = current_guess.toString();
					save_data[current_guess.toString()] = (parseInt(save_data[current_guess.toString()]) + 1).toString();
					localStorage.setItem('stats', JSON.stringify(save_data));
				}
				current = "";
				current = current.slice(0, -1);
			} else if(!word_list.includes(current)) {
				wrong = true;
			}
		}
	};

</script>

<div class="header">
	<div class="itemcenter">
		Wordle
	</div>
	<div class="itemright">
		Next Wordle: {header_time}
	</div>
</div>
<main>
	{#each rows as row}
		<div class="wordle">
			{#each letters as i}
				<div id="square_big">
					{#if current_guess == row}
						{#if i < current.length}
							<div id="square" style={wrong ? "background-color: red;" : ""}>
								{current.split("")[i].toUpperCase()}
							</div>
						{/if}
					{:else if row < current_guess}
						<div id="square" style={word[i] == current_guesses[row][i] ? "background-color: green;" : word.includes(current_guesses[row][i]) ? "background-color: yellow;" : ""}>
							{current_guesses[row][i].toUpperCase()}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
	<div id="stats">
		<span>Completed in 1 try &nbsp;&nbsp;&nbsp;<progress id="stats-1" value={save_data[1].toString()} max={max_progess} /></span>
		<span>Completed in 2 tries <progress id="stats-2" value={save_data[2].toString()} max={max_progess} /></span>
		<span>Completed in 3 tries <progress id="stats-3" value={save_data[3].toString()} max={max_progess} /></span>
		<span>Completed in 4 tries <progress id="stats-4" value={save_data[4].toString()} max={max_progess} /></span>
		<span>Completed in 5 tries <progress id="stats-5" value={save_data[5].toString()} max={max_progess} /></span>
		<span>Completed in 6 tries <progress id="stats-6" value={save_data[6].toString()} max={max_progess} /></span>
	</div>
	<button on:click={() => {
		localStorage.removeItem('stats')
	}}>
		Clear savedata
	</button>
</main>

<style>

	.header {
		display: flex;
		align-items: center;
		width: 100vw;
		height: 60px;
		background-color: gray;
		font-size: 30px;
		padding-left: 20px;
		padding-right: 20px;
	}

	.itemcenter {
      flex: 0 1 auto;
      width: max-content;
      height: max-content; 
      position: absolute;             /* new */
      left: 50%;
      transform: translateX(-50%);
    }

	.itemright {
		flex: 0 1 auto;
		width: max-content;
		height: max-content;
		margin-left: auto;              /* new */
		margin-right: 50px;
	
	}
	main {
		padding: 1em;
		display: grid;
		place-items: center;
	}

	.wordle {
		display: flex;
		gap: 5px;
		margin-bottom: 5px;
	}

	#square_big {
		display:grid;
		height: 60px;
		width: 60px;
		background-color: gray;
		text-align: center;
		align-content: center;
		font-size: 40px;
		padding: 0px;
	}

	#square {
		display:grid;
		height: 60px;
		width: 60px;
		background-color: gray;
		text-align: center;
		align-content: center;
		font-size: 40px;
		padding: 0px;
	}

	#stats {
		display: flex;
		flex-direction: column;
		margin-top: 25px;
		margin-bottom: 25px;;
	}
</style>