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

  describe('element', function () {

    beforeEach(inject(function ($compile) {
      element = angular.element(
        '<form-success-modal></form-success-modal>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should have a modal element', function () {
      expect(element.find('.modal')[0]).toBeDefined();
    });

    it('should have a modal-body ', function () {
      expect(element.find('.modal-body')[0]).toBeDefined();
    });

    it('should tell the user the item was saved', function () {
      expect(element.find('.modal-body h2').text()).toEqual(
        ' Your item was created successfully!');
    });

    it('should have a modal-footer', function () {
      expect(element.find('.modal-footer')[0]).toBeDefined();
    });

    it('should have two butons in the footer', function () {
      expect(element.find('.modal-footer .btn').length).toEqual(2);
    });

    it('should have a button to return to the list', function () {
      expect(element.find('.modal-footer .btn-list').length).toEqual(
        1);
    });

    it('should have a button to create another item', function () {
      expect(element.find('.modal-footer .btn-create').length).toEqual(
        1);
    });

  });

  describe('directive isolated scope', function () {

    var isolatedScope;

    beforeEach(inject(function () {
      isolatedScope = element.isolateScope();
    }));

    it('should have a navigateTo method attached to the scope',
      function () {
        expect(isolatedScope.navigateTo).toBeDefined();
      });

  });

});
