#!/bin/sh
./node_modules/.bin/tsc src/scheduler.ts --outDir lib --target ES5 --declaration --module commonjs --removeComments &&
mkdir -p dist &&
./node_modules/.bin/browserify lib/scheduler.js --standalone Scheduler --outfile dist/scheduler.js
