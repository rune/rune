enum texts {
	hello_world,
	button_warning,
	
	length //for enum iteration
}

function init_localisation() {
	if variable_global_exists("language_text") {
		ds_map_destroy(global.language_text);
	}
	global.language_text = ds_map_create();
	
	global.language_text[? "en"] = array_create(texts.length);
	global.language_text[? "en"][texts.hello_world] = "Hello world";
	global.language_text[? "en"][texts.button_warning] = "Don't press the red button!";
	
	global.language_text[? "de"] = array_create(texts.length);
	global.language_text[? "de"][texts.hello_world] = "Hallo Welt";
	global.language_text[? "de"][texts.button_warning] = "Nicht den roten Knopf drücken!";
	
	global.language_text[? "ru"] = array_create(texts.length);
	global.language_text[? "ru"][texts.hello_world] = "Здравствуй мир";
	global.language_text[? "ru"][texts.button_warning] = "Не нажимайте на красную кнопку!";
	
	global.language_text[? "es"] = array_create(texts.length);
	global.language_text[? "es"][texts.hello_world] = "Hola, mundo";
	global.language_text[? "es"][texts.button_warning] = "¡No pulse el botón rojo!";
	
	global.language_text[? "pt"] = array_create(texts.length);
	global.language_text[? "pt"][texts.hello_world] = "Olá mundo";
	global.language_text[? "pt"][texts.button_warning] = "Não carregue no botão vermelho!";
	
	global.language = os_get_language();
	show_debug_message("os_get_language " + string(global.language));
	if not ds_map_exists(global.language_text, global.language) {
		global.language = "en";
	}
}

function text_localise(text) {
	var t = global.language_text[? global.language][text];
	return t;
}