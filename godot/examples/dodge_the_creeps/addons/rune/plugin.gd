tool
extends EditorPlugin

func _enter_tree():
	add_autoload_singleton("Rune", "res://addons/rune/rune.gd")
	pass

func _exit_tree():
	remove_autoload_singleton("Rune")
	pass
