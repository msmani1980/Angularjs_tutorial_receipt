'use strict';

describe('Directive: missingDailyExchangeModal', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element;
  var scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<missing-daily-exchange-modal></missing-daily-exchange-modal>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the missingDailyExchangeModal directive');
  }));
});
