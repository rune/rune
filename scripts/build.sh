#!/bin/sh

# Remove existing files from the output folder
rm -rf ./dist/**

# Compile TS to JS for npm imports
npx tsc --declaration

# Compile TS to JS for browser imports.
# Removes "export" to make a version of the SDK that can be used in the browser.
# This approach is a bit hacky and could be replaced by browserify in the future.
mkdir dist/browser
npx tsc --project tsconfig.browser.json
sed -i '' 's/\export //g' dist/browser/index.js
mv dist/browser/index.js dist/browser.js
rm -rf dist/browser