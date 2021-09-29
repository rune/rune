#!/bin/sh

# Remove existing files from the output folder
rm -rf ./dist/**

# Compile TS to JS for npm imports
npx tsc --declaration

# Export the SDK to be used in the browser:
# 1) Compile TS to JS
# 2) Add a bit of prepended JS code to e.g. setup process.env
# 3) Add the Rune SDK w/o "export" to add Rune to global namespace
# This is easier and more controllable than getting browserify to work.
mkdir dist/browser
npx tsc --project tsconfig.browser.json
cat src/browser.js >> dist/browser.js
sed 's/\export //g' dist/browser/index.js >> dist/browser.js
rm -rf dist/browser