'use strict';

describe('Directive: inputTextarea', function() {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<input-textarea></input-textarea>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('');
  }));
});
