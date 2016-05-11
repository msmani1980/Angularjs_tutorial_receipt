#start firefox on the background
/usr/bin/firefox &

npm config set registry http://registry.npmjs.org/
npm cache clean
npm install
bower install
grunt jshint
grunt test
grunt build

# kill firefox after tests
ps -ef | grep firefox | grep -v grep | awk '{print $2}' | xargs kill -9