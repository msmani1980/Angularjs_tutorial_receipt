'use strict';

describe('Directive: qrCreate', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<qr-create></qr-create>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the qrCreate directive');
  }));
});
