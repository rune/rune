function browser_get_device_pixel_ratio() {
    return window.devicePixelRatio || 1;
}

function browser_stretch_canvas_ext(canvas_id, w, h) {
    var el = document.getElementById(canvas_id);
    el.style.width = w + "px";
    el.style.height = h + "px";
}