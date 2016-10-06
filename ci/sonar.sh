#!/bin/sh

pushd `dirname $0`/.. > /dev/null
root=$(pwd -P)
popd > /dev/null

source $root/ci/vars.sh

## Install Dependencies ########################################################

npm install


## Run Tests ###################################################################

if [ $(uname) == Darwin ]
  then npm run test:ci           # Local development
  else xvfb-run npm run test:ci  # Jenkins
fi

# EXPERIMENT/HACK EXPERIMENT/HACK EXPERIMENT/HACK EXPERIMENT/HACK EXPERIMENT/HACK
# Leave _some_ artifact for SonarQube to find
./node_modules/.bin/tsc
