'use strict';

describe('The Item Price Type directive', function () {

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

      var panelBody,
      priceDetailsColumn,
      priceCurrenciesColumn;

      beforeEach(function () {
        panelBody = angular.element(panel.find('.panel-body')[0]);
        priceDetailsColumn = angular.element(panelBody.find(' > .row > .col-xs-12')[0]);
        priceCurrenciesColumn = angular.element(panelBody.find(' > .row > .col-xs-12')[1]);
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

        it('should be defined in the DOM', function () {
          expect(priceDetailsColumn).toBeDefined();
        });

        it('should have a .col-sm-8 class', function () {
          expect(priceDetailsColumn.hasClass('col-sm-8')).toBeTruthy();
        });

        describe('the date picker row', function () {

          var datePickerRow;

          beforeEach(function () {
            $scope.$parent.minDate = '10/16/2015';
            $scope.$digest();
            datePickerRow = angular.element(priceDetailsColumn.find(' > .row')[0]);
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

        describe('the price type row', function () {

          var priceTypeRow;

          beforeEach(function () {
            priceTypeRow = angular.element(priceDetailsColumn.find(' > .row')[1]);
          });

          it('should be defined in the DOM', function () {
            expect(priceTypeRow).toBeDefined();
          });

          it('should have a two columns in the row', function () {
            expect(priceTypeRow.find(' > .col-xs-12.col-sm-6').length).toEqual(2);
          });

          describe('the price type column', function () {

            var priceTypeColumm;

            beforeEach(function () {
              priceTypeColumm = angular.element(priceTypeRow.find(' > .col-xs-12.col-sm-6')[0]);
            });

            it('should be defined in the DOM', function () {
              expect(priceTypeColumm).toBeDefined();
            });

            it('should have a label with the correct text', function () {
              expect(priceTypeColumm.find('label').text()).toEqual('Price Type *');
            });

            describe('the price type select', function () {

              var priceTypeSelect;

              beforeEach(function () {
                priceTypeSelect = angular.element(priceTypeColumm.find('select')[0]);
              });

              it('should be defined in the DOM', function () {
                expect(priceTypeSelect).toBeDefined();
              });

              it('should have the name attribute defined', function () {
                expect(priceTypeSelect.attr('name')).toEqual('Price Type');
              });

              it('should have the required attribute defined', function () {
                expect(priceTypeSelect.attr('required')).toEqual('required');
              });

              it('should have the ng-model attribute defined', function () {
                expect(priceTypeSelect.attr('ng-model')).toEqual('itemPrice.typeId');
              });

              it('should repeat options from the priceTypesJSON', function () {
                expect(priceTypeSelect.find('option').length-1).toEqual(priceTypesJSON.length);
              });

              describe('repeat option', function () {

                var option;

                beforeEach(function () {
                  option = angular.element(priceTypeSelect.find('option')[1]);
                });

                it('should be defined in the DOM', function () {
                  expect(option).toBeDefined();
                });

                it('should have a ng-selected attribute', function () {
                  expect(option.attr('ng-selected')).toEqual('type.id === itemPrice.typeId');
                });

                it('should have a ng-repeat attribute', function () {
                  expect(option.attr('ng-repeat')).toEqual('type in $parent.priceTypes');
                });

                it('should be defined in the DOM', function () {
                  expect(option).toBeDefined();
                });

                it('should set the value from the priceTypesJSON', function () {
                  expect(option.attr('value')).toEqual(priceTypesJSON[0].id.toString());
                });

                it('should set the option display from the priceTypesJSON', function () {
                  expect(option.text()).toEqual(priceTypesJSON[0].name);
                });

              });

            });

          });

          describe('the tax is column', function () {

            var taxIsColumn;

            beforeEach(function () {
              taxIsColumn = angular.element(priceTypeRow.find(' > .col-xs-12.col-sm-6')[1]);
            });

            it('should be defined in the DOM', function () {
              expect(taxIsColumn).toBeDefined();
            });

            it('should have a label with the correct text', function () {
              expect(taxIsColumn.find('label').text()).toEqual('Tax Is *');
            });

            describe('the tax is select', function () {

              var taxIsSelect,
               includedOption,
               excludedOption,
               exemptOption;

              beforeEach(function () {
                taxIsSelect = angular.element(taxIsColumn.find('select')[0]);
                includedOption = angular.element(taxIsSelect.find('option')[1]);
                excludedOption = angular.element(taxIsSelect.find('option')[2]);
                exemptOption = angular.element(taxIsSelect.find('option')[3]);
              });

              it('should be defined in the DOM', function () {
                expect(taxIsSelect).toBeDefined();
              });

              it('should have the name attribute defined', function () {
                expect(taxIsSelect.attr('name')).toEqual('Tax Is');
              });

              it('should have the required attribute defined', function () {
                expect(taxIsSelect.attr('required')).toEqual('required');
              });

              it('should have the ng-model attribute defined', function () {
                expect(taxIsSelect.attr('ng-model')).toEqual('itemPrice.taxIs');
              });

              it('should have (3) options', function () {
                expect(taxIsSelect.find('option').length).toEqual(4);
              });

              describe('included option', function () {

                it('should be defined in the DOM', function () {
                  expect(includedOption).toBeDefined();
                });

                it('should the correct value', function () {
                  expect(includedOption.attr('value')).toEqual('Included');
                });

                it('should display the correct label', function () {
                  expect(includedOption.text()).toEqual('Included');
                });

              });

              describe('excluded option', function () {

                it('should be defined in the DOM', function () {
                  expect(excludedOption).toBeDefined();
                });

                it('should the correct value', function () {
                  expect(excludedOption.attr('value')).toEqual('Excluded');
                });

                it('should display the correct label', function () {
                  expect(excludedOption.text()).toEqual('Excluded');
                });

              });

              describe('exempt option', function () {

                it('should be defined in the DOM', function () {
                  expect(exemptOption).toBeDefined();
                });

                it('should the correct value', function () {
                  expect(exemptOption.attr('value')).toEqual('Exempt');
                });

                it('should display the correct label', function () {
                  expect(exemptOption.text()).toEqual('Exempt');
                });

              });

            });

          });

        });

      });

      describe('the price currencies columm', function () {

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
