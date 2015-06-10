'use strict';

describe('The tax type input directive', function () {

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
        '<input-tax-type></input-tax-type>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should have a panel element', function () {
      expect(element.find('.panel')[0]).toBeDefined();
    });

    describe('panel heading', function () {

      it('should have a panel-heading', function () {
        expect(element.find('.panel-title')[0]).toBeDefined();
      });

      it('should have a panel-title as a child of panel-heading',
        function () {
          expect(element.find('.panel-heading .panel-title')[0]).toBeDefined();
        });

      it('should have the correct heading label', function () {
        expect(element.find('.panel-title').text().trim()).toEqual(
          'Tax Type 1');
      });

    });

    describe('panel body', function () {

      it('should have a panel-body', function () {
        expect(element.find('.panel-body')[0]).toBeDefined();
      });

      it('should have a row', function () {
        expect(element.find('.panel-body .row')[0]).toBeDefined();
      });

      it('should have a two columns in the row', function () {
        expect(element.find('.row .col-xs-12').length).toEqual(
          2);
      });

    });

  });

});
