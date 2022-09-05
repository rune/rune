draw_self();

draw_set_font(fnt_example);
draw_set_halign(fa_center);
draw_text(540, 100, global.current_score);
var warn = text_localise(texts.button_warning);
draw_text_ext(540, 1540, warn, string_height(warn), 960);