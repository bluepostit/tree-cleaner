#!/bin/bash

rm -rf test-*
echo "Creating test directories"
yarn testdirs
echo "Running the app..."
yarn start --debug -d10 test-*

echo "Cleaning up..."
rm -rf test-*
