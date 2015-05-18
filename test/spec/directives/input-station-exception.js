'use strict';

describe('Directive: inputStationException', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<input-station-exception></input-station-exception>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the inputStationException directive');
  }));
});
