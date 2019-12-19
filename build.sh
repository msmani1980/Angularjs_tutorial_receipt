#start firefox on the background
#/usr/bin/firefox &

npm config set registry http://registry.npmjs.org/
npm cache clean

cat package.json
echo "******* NPM INSTALL - start  *******"
npm install grunt --save-dev
npm install --save-dev time-grunt
npm install --save-dev load-grunt-tasks
npm install --save-dev jshint-stylish
npm install autoprefixer-core --save-dev
npm install csswring --save-dev
npm install
echo "******* NPM INSTALL - finish  *******"

echo "####### BOWER - start #######"
bower install
echo "####### BOWER - finish #######"
# grunt test

echo "@@@@@@@@@ GRUNT start @@@@@@@@"
grunt build && grunt jshint && grunt jscs
echo "@@@@@@@@@ GRUNT finish @@@@@@@@"

# kill firefox after tests
#ps -ef | grep firefox | grep -v grep | awk '{print $2}' | xargs kill -9
