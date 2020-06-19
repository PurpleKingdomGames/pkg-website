#!/bin/bash

set -e

cd website
yarn run build
cd ..

cp website/CNAME website/build/purple-kingdom-games-site

rm -fr docs
mkdir docs
cp -R website/build/purple-kingdom-games-site/* docs/
