extends Node

signal resume_game
signal pause_game
signal restart_game

var noHtmlMessage = "Games using the Rune SDK must be run in the browser and tested using the Rune CLI. See https://github.com/rune/rune-games-sdk/tree/staging/godot for instructions."
var noRuneMessage = "It seems you forgot to include Rune SDK in HTML5 export options. See https://github.com/rune/rune-games-sdk/tree/staging/godot for instructions."

func _ready():
	randomize()

func _assert_rune():
	if !is_emulated():
		assert(JavaScript.create_object("Object"), noHtmlMessage)
		assert(_Rune, noRuneMessage)

func init(ref):
	var inited := is_initialized()
	assert(is_instance_valid(ref))
	_ref = ref
	if is_emulated():
		get_tree().create_timer(1).connect("timeout", self, "_resume_game", [null])
		return
	
	if inited:
		return
	
	_assert_rune()

	var obj = JavaScript.create_object("Object")

	obj.resumeGame = _resume_game_cb
	obj.pauseGame = _pause_game_cb
	obj.restartGame = _restart_game_cb
	obj.getScore = _get_score_cb

	_get_score_cb.callbackReturnValueNotSupported = true

	_Rune.init(obj)

func game_over() -> void:
	if is_emulated():
		get_tree().create_timer(1).connect("timeout", self, "_restart_game", [null])
		return
	_assert_rune()
	_Rune.gameOver()

func deterministic_random() -> float:
	if is_emulated():
		return randf()
	_assert_rune()
	return _Rune.deterministicRandom()

func get_challenge_number() -> int:
	if is_emulated():
		return 0
	_assert_rune()
	return _Rune.getChallengeNumber() as int

func is_initialized()->bool:
	return is_instance_valid(_ref)

func is_emulated()->bool:
	return !is_initialized() or OS.get_name() != "HTML5"


var _Rune = JavaScript.get_interface("Rune")
var _resume_game_cb = JavaScript.create_callback(self, "_resume_game")
var _pause_game_cb = JavaScript.create_callback(self, "_pause_game")
var _restart_game_cb = JavaScript.create_callback(self, "_restart_game")
var _get_score_cb = JavaScript.create_callback(self, "_get_score")
var _ref

func _resume_game(args):
	if is_initialized():
		if _ref.has_method("rune_resume_game"):
			_ref.rune_resume_game()
	emit_signal("resume_game")

func _pause_game(args):
	if is_initialized():
		if _ref.has_method("rune_pause_game"):
			_ref.rune_pause_game()
	emit_signal("pause_game")

func _restart_game(args):
	if is_emulated():
		_resume_game(null)
	
	if is_initialized():
		if _ref.has_method("rune_restart_game"):
			_ref.rune_restart_game()
	emit_signal("restart_game")

func _get_score(args):
	var score = _ref.rune_get_score()
	_get_score_cb.score = 0 if score == null else score
