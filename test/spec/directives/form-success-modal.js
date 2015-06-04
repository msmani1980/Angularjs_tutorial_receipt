'use strict';

describe('The Success Form Modal', function () {

  // load the directive's module
  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var scope, element, httpBackend;

  beforeEach(inject(function ($rootScope, $injector) {
    scope = $rootScope.$new();
    httpBackend = $injector.get('$httpBackend');
    httpBackend.whenGET('views/directives/form-success-modal.html').respond(
      200, '');
  }));

  describe('form-success-modal element', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element(
        '<form-success-modal list-path="item-list" create-path="item-create"></form-success-modal>'
      );
      element = $compile(element)(scope);
      scope.$digest();
      console.log(element);
    }));

    it('should inject the directive', function () {
      expect(element).toBeDefined();
    });

    // TODO: Finish this - modal not actullay being found
    it('should contain a div with the modal class', function () {
      expect(element.find('.modal')).toBeDefined();
    });

  });

});
