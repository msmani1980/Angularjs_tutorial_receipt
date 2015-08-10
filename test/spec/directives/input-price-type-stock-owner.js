'use strict';

describe('The Stock Owner Item Price Type directive', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/price-types.json'));

  var element,
    $scope,
    priceTypesJSON;

  beforeEach(inject(function ($rootScope,_servedPriceTypes_) {
    $scope = $rootScope.$new();
    priceTypesJSON = _servedPriceTypes_;
    $scope.priceTypes = _servedPriceTypes_;
  }));

  describe('the panel component', function() {

    var panel;
    beforeEach(inject(function ($compile) {
      element = angular.element('<input-price-type-stock-owner></input-price-type-stock-owner>');
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
          expect(panelTitle.text().trim()).toEqual('Cost Price 1');
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

      var panelBody,
      datePickerColumn,
      costPricesColumn; 

      beforeEach(function () {
        panelBody = angular.element(panel.find('.panel-body')[0]);
        datePickerColumn = angular.element(panelBody.find(' > .row > .col-xs-12.col-sm-8')[0]);
        costPricesColumn = angular.element(panelBody.find(' > .row > .col-xs-12.col-sm-4')[0]);
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

      describe('the date picker columm', function () {

        it('should be defined in the DOM', function () {
          expect(datePickerColumn).toBeDefined();
        });

        it('should have a .col-sm-8 class', function () {
          expect(datePickerColumn.hasClass('col-sm-8')).toBeTruthy();
        });

        describe('the date picker row', function () {

          var datePickerRow;

          beforeEach(function () {
            datePickerRow = angular.element(datePickerColumn.find(' > .row')[0]);
          });

          it('should be defined in the DOM', function () {
            expect(datePickerRow).toBeDefined();
          });

          it('should have (2) .col-xs-12 columns', function () {
            expect(datePickerRow.find('> .col-xs-12.col-sm-6').length).toEqual(2);
          });

          it('should have (2) date picker field directives', function () {
            expect(datePickerRow.find('> .col-xs-12 date-picker-field').length).toEqual(2);
          });

          describe('Effective From date picker', function () {

            var datePicker;

            beforeEach(function () {
              datePicker = angular.element(datePickerRow.find('> .col-xs-12 date-picker-field')[0]);
            });

            it('should be defined in the DOM', function () {
              expect(datePicker).toBeDefined();
            });

            it('should have the form attribute defined', function () {
              expect(datePicker.attr('form')).toEqual('form');
            });

            it('should have the label attribute defined', function () {
              expect(datePicker.attr('label')).toEqual('Effective From');
            });

            it('should have the name attribute defined', function () {
              expect(datePicker.attr('name')).toEqual('PriceEffectiveFrom');
            });

            it('should have the ng-model attribute defined', function () {
              expect(datePicker.attr('ng-model')).toEqual('itemPrice.startDate');
            });

            it('should have the required attribute defined', function () {
              expect(datePicker.attr('required')).toEqual('required');
            });

          });

          describe('Effective To date picker', function () {

            var datePicker;

            beforeEach(function () {
              datePicker = angular.element(datePickerRow.find('> .col-xs-12 date-picker-field')[1]);
            });

            it('should be defined in the DOM', function () {
              expect(datePicker).toBeDefined();
            });

            it('should have the form attribute defined', function () {
              expect(datePicker.attr('form')).toEqual('form');
            });

            it('should have the label attribute defined', function () {
              expect(datePicker.attr('label')).toEqual('Effective To');
            });

            it('should have the name attribute defined', function () {
              expect(datePicker.attr('name')).toEqual('PriceEffectiveTo');
            });

            it('should have the ng-model attribute defined', function () {
              expect(datePicker.attr('ng-model')).toEqual('itemPrice.endDate');
            });

            it('should have the required attribute defined', function () {
              expect(datePicker.attr('required')).toEqual('required');
            });

          });

        });

    });

    describe('the cost prices columm', function () {

      it('should be defined in the DOM', function () {
        expect(costPricesColumn).toBeDefined();
      });

      it('should have a .col-sm-4 class', function () {
        expect(costPricesColumn.hasClass('col-sm-4')).toBeTruthy();
      });

    });

  });

});

});
