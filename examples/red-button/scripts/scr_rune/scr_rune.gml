function gmcallback_restart_game() {
	show_debug_message("Restart game");
	init_game();
	global.current_score = 0;
}

function gmcallback_get_score() {
	show_debug_message("Get score");
	return global.current_score;
}

function gmcallback_resume_game() {
	show_debug_message("Resume game");
	with obj_pause instance_destroy();
	if variable_global_exists("pause_surface") and surface_exists(global.pause_surface) {
		surface_free(global.pause_surface);
	}
	global.pause_surface = noone;
	global.pause = false;
	instance_activate_all();
}

function gmcallback_pause_game() {
	show_debug_message("Pause game");
	global.pause = true;
	if surface_exists(application_surface) {
		global.pause_surface = surface_create(surface_get_width(application_surface), surface_get_height(application_surface));
		surface_copy(global.pause_surface, 0, 0, application_surface);
	}
	instance_deactivate_all(false);
	instance_create_depth(0, 0, 0, obj_pause);
}

function init_game(){
	random_set_seed(rune_challenge_nr()); //Use challenge nr as seed for GML random methods
	gmcallback_resume_game();
	
	var rz = browser_get_device_pixel_ratio();
	var avail_w = browser_width * rz;
	var avail_h = browser_height * rz;
	show_debug_message("game resize to " + string(avail_w) + " " + string(avail_h));
	
	window_set_size(avail_w, avail_h);
	browser_stretch_canvas_ext(window_handle(), browser_width, browser_height);
	surface_resize(application_surface,avail_w, avail_h); //Resize application surface
	display_set_gui_size(avail_w, avail_h); //Resize GUI
	
	var format = avail_w / avail_h;
	var camera_base_w = 1080;
	var camera_base_format = 9/16;
	var camera_base_h = camera_base_w / camera_base_format;
	var view_w, view_h;
	if format >= camera_base_format {
		view_h = camera_base_h;
		view_w = view_h * format;
	} else {
		view_w = camera_base_w;
		view_h = view_w / format;
	}
	camera_set_view_size(view_camera[0], view_w, view_h); //Resize view
	camera_set_view_pos(view_camera[0], (camera_base_w - view_w) / 2, (camera_base_h - view_h) / 2); //Center view
}