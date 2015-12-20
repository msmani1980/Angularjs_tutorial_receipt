// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-04-14 using
// generator-karma 0.9.0

module.exports = function (config) {
  'use strict';

  config.set({
    // to avoid DISCONNECTED messages
    browserDisconnectTimeout: 10000, // default 2000
    browserDisconnectTolerance: 1, // default 0
    browserNoActivityTimeout: 60000, //default 10000
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    //
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'app/scripts/**/*.js': ['coverage'],
      'app/views/**/*.html': ['ng-html2js'],
      'test/mock/**/*.json': ['ng-json2js']
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        // reporters not supporting the `file` property
        {
          type: 'html',
          subdir: 'report-html'
        }, {
          type: 'cobertura',
          subdir: '.'
        }
      ]
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app',
      moduleName: 'template-module'
    },

    ngJson2JsPreprocessor: {
      stripPrefix: 'test/mock/',
      prependPrefix: 'served/'
    },

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-dragdrop/draganddrop.js',
      'bower_components/angular-filter/dist/angular-filter.min.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/qrcode/lib/qrcode.js',
      'bower_components/angular-qr/src/angular-qr.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js',
      'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/ng-lodash/build/ng-lodash.js',
      'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/ngtoast/dist/ngToast.js',
      'bower_components/select2/select2.js',
      'bower_components/bootstrap-switch/dist/js/bootstrap-switch.js',
      'bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/sha256/index.js',
      'bower_components/enc-base64-min/index.js',
      'bower_components/aes/index.js',
      'bower_components/angular-scroll/angular-scroll.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/sprintf/dist/sprintf.min.js',
      'bower_components/sprintf/dist/angular-sprintf.min.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.json',
      'test/spec/**/*.js',
      //location of templates
      'app/views/**/*.html'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-ng-json2js-preprocessor',
      'karma-coverage'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_ERROR

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
