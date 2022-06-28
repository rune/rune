extends Node

func init(ref):
	if(!_Rune): return

	_ref = ref

	var obj = JavaScript.create_object("Object")

	obj.resumeGame = _resume_game_cb
	obj.pauseGame = _pause_game_cb
	obj.restartGame = _restart_game_cb
	obj.getScore = _get_score_cb

	_get_score_cb.callbackReturnValueNotSupported = true

	_Rune.init(obj)

func game_over():
	if(!_Rune): return
	_Rune.gameOver()

func deterministicRandom():
	if(!_Rune): return 0.5
	return _Rune.deterministicRandom()

func getChallengeNumber():
	if(!_Rune): return 1
	return _Rune.getChallengeNumber()

var _Rune = JavaScript.get_interface("Rune")
var _resume_game_cb = JavaScript.create_callback(self, "_resume_game")
var _pause_game_cb = JavaScript.create_callback(self, "_pause_game")
var _restart_game_cb = JavaScript.create_callback(self, "_restart_game")
var _get_score_cb = JavaScript.create_callback(self, "_get_score")
var _ref

func _resume_game(args):
	_ref.rune_resume_game()

func _pause_game(args):
	_ref.rune_pause_game()

func _restart_game(args):
	_ref.rune_restart_game()

func _get_score(args):
	var score = _ref.rune_get_score()
	_get_score_cb.score = 0 if score == null else score
