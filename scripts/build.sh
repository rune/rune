#!/bin/sh

# Remove existing files from the build folder
rm -rf ./build/*

# Compile TS to JS
npx tsc