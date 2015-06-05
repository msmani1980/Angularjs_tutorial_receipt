'use strict';

describe('The form success modal', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var scope,
    element;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  describe('form-success-modal element', function () {
    beforeEach(inject(function ($compile) {
      element = angular.element('<form-success-modal></form-success-modal>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should have a modal element', function () {
      expect(element).toBeDefined();
    });

  });
});
