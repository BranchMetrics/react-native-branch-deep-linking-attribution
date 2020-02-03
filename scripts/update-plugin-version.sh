#!/bin/bash

set -e
# set -x

# Attribution: https://medium.com/@andr3wjack/versioning-react-native-apps-407469707661

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')

# update Android build.gradle
sed -i '' -e "/pluginVersion/ {s/\".*\"/\"$PACKAGE_VERSION\"/; }" android/build.gradle

# update iOS RNBranchConfig.m
sed -i '' -e "/RNBNC_PLUGIN_VERSION/ {s/\".*\"/\"$PACKAGE_VERSION\"/; }" ios/RNBranchConfig.m

# this script runs runs AFTER bumping the package version, but BEFORE commit, so we need to git add.
# More info: https://docs.npmjs.com/misc/scripts
git add ./android/build.gradle
git add ./ios/RNBranchConfig.m
