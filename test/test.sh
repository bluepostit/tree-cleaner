#!/bin/env bash

rm -rf test-*
echo "Creating test directories"
npm run testdirs

echo
echo "-----------------"
echo "Running the app..."
npm run start -- --debug --verbose -d3 test-*

echo
echo "Cleaning up..."
rm -rf test-*
echo "Done"
