'use strict';

describe('Directive: stockAdjustmentPopover', function() {

  // load the directive's module
  beforeEach(module('ts5App'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  /* TODO: fix me
    it('should make hidden element visible', inject(function ($compile) {
      element = angular.element('<stock-adjustment-popover></stock-adjustment-popover>');
      element = $compile(element)(scope);
      expect(element.text()).toBe('this is the stockAdjustmentPopover directive');
    }));
    */
});
