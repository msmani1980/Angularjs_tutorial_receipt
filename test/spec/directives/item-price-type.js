'use strict';

describe('The Item Price Type directive', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element,
    $scope;

  beforeEach(inject(function ($rootScope) {
    $scope = $rootScope.$new();
  }));

  describe('the panel component', function() {

    var panel;
    beforeEach(inject(function ($compile) {
      element = angular.element('<input-price-type></input-price-type>');
      element = $compile(element)($scope);
      $scope.$digest();
      panel = angular.element(element.find('.panel')[0]);
    }));

    it('should be defined in the DOM', function () {
      expect(panel).toBeDefined();
    });

    it('should have the panel-default class', function () {
      expect(panel.hasClass('panel-default')).toBeTruthy();
    });

    describe('panel-heading component', function() {

      var panelHeading;
      beforeEach(function() {
        panelHeading = angular.element(panel.find('.panel-heading')[0]);
      });

      it('should be defined in the DOM', function () {
        expect(panelHeading).toBeDefined();
      });

      describe('panel-title component', function() {

        var panelTitle;
        beforeEach(function() {
          panelTitle = angular.element(panelHeading.find('.panel-title')[0]);
        });

        it('should be defined in the DOM', function () {
          expect(panelTitle).toBeDefined();
        });

        it('should have a tags icon', function () {
          expect(panelTitle.find('.fa-tags')[0]).toBeDefined();
        });

        it('should have a tags icon', function () {
          expect(panelTitle.text().trim()).toEqual('Price Type 1');
        });

        describe('remove button', function () {

          var removeBtn;
          beforeEach(function () {
            removeBtn = angular.element(panelTitle.find('.btn-remove-price-group')[0]);
          });

          it('should be present in the DOM', function () {
            expect(removeBtn[0]).toBeDefined();
          });

          it('should have a btn-danger class', function () {
            expect(removeBtn.hasClass('btn-danger')).toBeTruthy();
          });

          it('should contain an close icon', function () {
            expect(removeBtn.find('i.fa-close')[0]).toBeDefined();
          });

          it('should have an click event to remove tax types', function () {
            expect(removeBtn.attr('ng-click')).toEqual('removePriceGroup($parent.key)');
          });

        });

      });

    });

    describe('panel body', function () {

      var panelBody;
      beforeEach(function () {
        panelBody = angular.element(panel.find('.panel-body')[0]);
      });

      it('should be defined in the DOM', function () {
        expect(panelBody).toBeDefined();
      });

      it('should have a row', function () {
        expect(panelBody.find(' > .row')[0]).toBeDefined();
      });

      it('should have a two columns in the row', function () {
        expect(panelBody.find( '> .row > .col-xs-12').length).toEqual(2);
      });

      describe('the price details columm', function () {

        var priceDetailsColumn;
        beforeEach(function () {
          priceDetailsColumn = angular.element(panelBody.find(' > .row > .col-xs-12')[0]);
        });

        it('should be defined in the DOM', function () {
          expect(priceDetailsColumn).toBeDefined();
        });

        it('should have a .col-sm-8 class', function () {
          expect(priceDetailsColumn.hasClass('col-sm-8')).toBeTruthy();
        });

      });

      describe('the price currencies columm', function () {

        var priceCurrenciesColumn;
        beforeEach(function () {
          priceCurrenciesColumn = angular.element(panelBody.find(' > .row > .col-xs-12')[1]);
        });

        it('should be defined in the DOM', function () {
          expect(priceCurrenciesColumn).toBeDefined();
        });

        it('should have a .col-sm-4 class', function () {
          expect(priceCurrenciesColumn.hasClass('col-sm-4')).toBeTruthy();
        });

      });

    });

  });

});
