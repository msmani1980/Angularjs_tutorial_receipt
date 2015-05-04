'use strict';

describe('Directive: imageUpload', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should be inject into the DOM', inject(function ($compile) {

    element = angular.element('<image-upload></image-upload>');

    element = $compile(element)(scope);

    expect(element).toBeDefined(); 

  }));
});
