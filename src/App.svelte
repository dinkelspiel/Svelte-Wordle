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

	let is_mobile = false;
	window.mobileAndTabletCheck = function() {
		let check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		is_mobile = check;
	};
	

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
			check_word();
		}
	};

	function check_word() {
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
	{#if !stop}
		<span>
			<input/>
			<button on:click={() => check_word()}>Check</button>
		</span>
	{/if}
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