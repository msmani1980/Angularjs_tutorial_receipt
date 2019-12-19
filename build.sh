#start firefox on the background
#/usr/bin/firefox &

npm config set registry http://registry.npmjs.org/
npm cache clean

echo "!!!!!!!!!!!!!!!! NPM config - start  !!!!!!!!!!!!!!!!"
npm config get production

npm config list

npm config ls -l


echo "!!!!!!!!!!!!!!!! NPM config - start  !!!!!!!!!!!!!!!!"

echo "******* NPM INSTALL - start  *******"
npm install grunt --save-dev
npm install --save-dev time-grunt
npm install --save-dev load-grunt-tasks
npm install --save-dev jshint-stylish
npm install autoprefixer-core --save-dev
npm install csswring --save-dev
npm install grunt-concurrent --save-dev
npm install grunt-contrib-clean --save-dev
npm install grunt-contrib-concat --save-dev
npm install grunt-contrib-connect --save-dev
npm install grunt-contrib-copy --save-dev
npm install grunt-contrib-cssmin --save-dev
npm install grunt-contrib-htmlmin --save-dev
npm install grunt-contrib-imagemin --save-dev
npm install grunt-contrib-jshint --save-dev
npm install grunt-contrib-uglify --save-dev
npm install grunt-contrib-watch --save-dev
npm install grunt-filerev --save-dev
npm install grunt-google-cdn --save-dev
npm install grunt-jscs --save-dev
npm install grunt-karma --save-dev
npm install grunt-newer --save-dev
npm install grunt-ng-annotate --save-dev
npm install grunt-ng-constant --save-dev
npm install grunt-postcss --save-dev
npm install grunt-sass --save-dev
npm install grunt-svgmin --save-dev
npm install grunt-usemin --save-dev
npm install grunt-wiredep --save-dev
npm install jasmine-core --save-dev
npm install jasmine-reporters --save-dev
npm install jshint-stylish --save-dev
npm install karma --save-dev
npm install karma-chrome-launch --save-dev
npm install karma-covera --save-dev
npm install karma-firefox-launch --save-dev
npm install karma-jasmi --save-dev
npm install karma-ng-html2js-preprocess --save-dev
npm install karma-ng-json2js-preprocess --save-dev
npm install pre-commit --save-dev
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
