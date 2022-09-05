function rune_init() {
	console.log("rune_init");
	Rune.init({
		restartGame: _73,
   		getScore: _93,
		resumeGame: _b3,
		pauseGame: _d3
	});
} 

function rune_gameover() {
	console.log("rune_gameover");
	Rune.gameOver();
}

function rune_challenge_nr() {
	console.log("rune_challenge_nr");
	return Rune.getChallengeNumber();
}