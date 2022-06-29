extends Node

export(PackedScene) var mob_scene
var score

func rune_resume_game():
	get_tree().paused = false

func rune_pause_game():
	get_tree().paused = true

func rune_restart_game():
	new_game()

func rune_get_score():
	return score

func _ready():
	
	randomize()
	
	$ColorRect.color = Color(
		Rune.deterministicRandom() * 0.75,
		Rune.deterministicRandom() * 0.75,
		Rune.deterministicRandom() * 0.75,
		1
	)
	$HUD.update_challenge_number(str("Challenge ", Rune.getChallengeNumber()))
	
	$HUD.start_game()
	get_tree().paused = true
	
	Rune.init(self)


func game_over():
	$ScoreTimer.stop()
	$MobTimer.stop()
	$Music.stop()
	$DeathSound.play()
	Rune.game_over()


func new_game():
	get_tree().call_group("mobs", "queue_free")
	score = 0
	$Player.start($StartPosition.position)
	$StartTimer.start()
	$HUD.update_score(score)
	$HUD.show_message("Get Ready")
	$Music.play()


func _on_MobTimer_timeout():
	# Create a new instance of the Mob scene.
	var mob = mob_scene.instance()

	# Choose a random location on Path2D.
	var mob_spawn_location = get_node("MobPath/MobSpawnLocation")
	mob_spawn_location.offset = randi()

	# Set the mob's direction perpendicular to the path direction.
	var direction = mob_spawn_location.rotation + PI / 2

	# Set the mob's position to a random location.
	mob.position = mob_spawn_location.position

	# Add some randomness to the direction.
	direction += rand_range(-PI / 4, PI / 4)
	mob.rotation = direction

	# Choose the velocity for the mob.
	var velocity = Vector2(rand_range(150.0, 250.0), 0.0)
	mob.linear_velocity = velocity.rotated(direction)

	# Spawn the mob by adding it to the Main scene.
	add_child(mob)

func _on_ScoreTimer_timeout():
	score += 1
	$HUD.update_score(score)


func _on_StartTimer_timeout():
	$MobTimer.start()
	$ScoreTimer.start()
