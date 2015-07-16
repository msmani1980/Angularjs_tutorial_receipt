'use strict';

describe('Excel Upload Directive |', function () {

  var scope,
    Upload;

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/excel-upload.json'));
  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  beforeEach(inject(function (_Upload_) {
    Upload = _Upload_;
    scope.$digest();
  }));

});
