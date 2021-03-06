'use strict';

describe('The form update modal', function () {

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
        '<form-update-modal></form-update-modal>');
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
      expect(element.find('.modal-body h2').text().trim()).toEqual(
        'Your item was updated successfully!');
    });

    it('should have a modal-footer', function () {
      expect(element.find('.modal-footer')[0]).toBeDefined();
    });

    it('should have two butons in the footer', function () {
      expect(element.find('.modal-footer .btn').length).toEqual(2);
    });

    it('should have a button to return to the list', function () {
      expect(element.find('.modal-footer .btn-list').length).toEqual(1);
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

  describe('when the list-path attribute is passed', function () {

    var isolatedScope;

    beforeEach(inject(function ($compile) {
      element = angular.element(
        '<form-update-modal list-path="item-list"></form-update-modal>'
      );
      element = $compile(element)(scope);
      scope.$digest();
      isolatedScope = element.isolateScope();
    }));

    it('should have have a list path attribute',
      function () {
        expect(element.attr('list-path')).toBeDefined();
      });

    it('should match the listPath variable passed to the directive',
      function () {
        expect(element.attr('list-path')).toEqual(isolatedScope.listPath);
      });

  });

});
