function rune_init() {
	console.log("rune_init");
	Rune.init({
		restartGame: gml_Script_gmcallback_restart_game,
   		getScore: gml_Script_gmcallback_get_score,
		resumeGame: gml_Script_gmcallback_resume_game,
		pauseGame: gml_Script_gmcallback_pause_game
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