extends Node

var noHtmlMessage = "Games using the Rune SDK must be run in the browser and tested using the Rune CLI. See https://github.com/rune/rune-games-sdk/tree/staging/godot for instructions."
var noRuneMessage = "It seems you forgot to include Rune SDK in HTML5 export options. See https://github.com/rune/rune-games-sdk/tree/staging/godot for instructions."

func _assert_rune():
	assert(JavaScript.create_object("Object"), noHtmlMessage)
	assert(_Rune, noRuneMessage)

func init(ref):
	_assert_rune()

	_ref = ref

	var obj = JavaScript.create_object("Object")

	obj.resumeGame = _resume_game_cb
	obj.pauseGame = _pause_game_cb
	obj.restartGame = _restart_game_cb
	obj.getScore = _get_score_cb

	_get_score_cb.callbackReturnValueNotSupported = true

	_Rune.init(obj)

func game_over():
	_assert_rune()
	_Rune.gameOver()

func deterministic_random():
	_assert_rune()
	return _Rune.deterministicRandom()

func get_challenge_number():
	_assert_rune()
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
