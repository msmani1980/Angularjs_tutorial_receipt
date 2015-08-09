'use strict';

describe('Directive: stockTakeReason', function() {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<stock-take-reason></stock-take-reason>');
    element = $compile(element)(scope);
    expect(element).toBeDefined();
  }));
});
