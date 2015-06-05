'use strict';

describe('The form success modal', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var element,
    scope,
    httpBackend;

  beforeEach(inject(function ($rootScope, $injector) {
    scope = $rootScope.$new();
    httpBackend = $injector.get('$httpBackend');
    httpBackend.whenGET('views/directives/form-success-modal.html').respond(
      200, '');
  }));

  describe('success modal template', function () {
    beforeEach(inject(function ($compile) {
      element = angular.element(
        '<form-success-modal></form-success-modal');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should have a modal element', function () {
      expect(element).toBeDefined();
      console.log(element);
    });

  });
});
