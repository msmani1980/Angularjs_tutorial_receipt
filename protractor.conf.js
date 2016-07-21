'use strict';

exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e_tests/**/*_spec.js'],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--disable-web-security', '--allow-file-access-from-files', '--ignore-certificate-errors']
    }
  },
  onPrepare: function () {
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      savePath: 'e2e_coverage'
    }, true, true));
  }
};
