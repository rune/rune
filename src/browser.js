/*
Pure JS code prepended to the exported JS SDK for the browser.
This is easier and more controllable than getting browserify to work.
*/
if (typeof process === "undefined") process = {}
if (typeof process.env === "undefined") process.env = {}
