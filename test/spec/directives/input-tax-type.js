'use strict';

describe('The tax type input directive', function () {

  var scope,
    element;

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/tax-types.json'));

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  describe('element', function () {

    beforeEach(inject(function ($compile) {
      inject(function (_servedTaxTypes_) {
        scope.taxTypes = _servedTaxTypes_.response;
      });
      element = angular.element('<input-tax-type></input-tax-type>');
      element = $compile(element)(scope);
      scope.$digest();
    }));

    it('should have an array of applied tax types attached to the scope', function () {
      expect(scope.appliedTaxTypes.length).toBeGreaterThan(0);
    });

    it('should have (3) applied tax types to be in the array', function () {
      expect(scope.appliedTaxTypes[0].name).toEqual('Gross');
      expect(scope.appliedTaxTypes[1].name).toEqual('Net');
      expect(scope.appliedTaxTypes[2].name).toEqual('None');
    });

    it('should have a panel element', function () {
      expect(element.find('.panel')[0]).toBeDefined();
    });

    it('should have the panel-title class', function () {
      expect(element.find('.panel').hasClass('panel-default')).toBeTruthy();
    });

    describe('panel heading', function () {

      it('should have a panel-heading', function () {
        expect(element.find('.panel-title')[0]).toBeDefined();
      });

      it('should have a panel-title as a child of panel-heading', function () {
        expect(element.find('.panel-heading .panel-title')[0]).toBeDefined();
      });

      it('should have the correct heading label', function () {
        expect(element.find('.panel-title').text().trim()).toEqual('Tax Type 1');
      });

      describe('remove button', function () {

        var removeBtn;

        beforeEach(function () {
          removeBtn = angular.element(element.find(
            '.btn-remove-tax-type')[0]);
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
          expect(removeBtn.attr('ng-click')).toEqual('removeTaxType($parent.key)');
        });

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

      describe('tax type input', function () {

        var column,
          label;

        beforeEach(function () {
          column = angular.element(element.find('.row .col-xs-12')[0]);
          label = angular.element(column.find('.form-group label')[0]);
        });

        it('should be present in the DOM', function () {
          expect(column[0]).toBeDefined();
        });

        it('should have a form-group', function () {
          expect(column.find('.form-group')[0]).toBeDefined();
        });

        it('should have label', function () {
          expect(label[0]).toBeDefined();
        });

        it('should have label with the correct text', function () {
          expect(label.text().trim()).toEqual('Tax Type *');
        });

        describe('taxt type select', function () {

          var select;

          beforeEach(function () {
            select = angular.element(column.find('select')[0]);
          });

          it('should be present in the DOM', function () {
            expect(select[0]).toBeDefined();
          });

          it('should be required', function () {
            expect(select.attr('required')).toBeTruthy();
          });

          it('should have the correct ng-model', function () {
            expect(select.attr('ng-model')).toEqual('itemTax.companyTaxId');
          });

          it('should have a name', function () {
            expect(select.attr('name')).toEqual('Tax Type');
          });

          it('should contain a list of options', function () {
            expect(select.find('option').length).toBeGreaterThan(0);
          });

          describe('option element', function () {

            var optionElement,
              optionJSON;

            beforeEach(function () {
              optionElement = angular.element(select.find('option')[1]);
              optionJSON = scope.taxTypes[0];
            });

            it('should have a value set as the taxType.id', function () {
              expect(optionElement.attr('value')).toEqual(optionJSON.id.toString());
            });

            it('should have a display the taxTypeCode as the value', function () {
              expect(optionElement.text().trim()).toEqual(optionJSON.taxTypeCode);
            });

          });

        });

      });

      describe('applied tax type', function () {

        var column,
          label;

        beforeEach(function () {
          column = angular.element(element.find('.row .col-xs-12')[1]);
          label = angular.element(column.find('.form-group label')[0]);
        });

        it('should be present in the DOM', function () {
          expect(column[0]).toBeDefined();
        });

        it('should have a form-group', function () {
          expect(column.find('.form-group')[0]).toBeDefined();
        });

        it('should have label', function () {
          expect(label[0]).toBeDefined();
        });

        it('should have label with the correct text', function () {
          expect(label.text().trim()).toEqual('Applied Tax Type *');
        });

        describe('select', function () {

          var select;

          beforeEach(function () {
            select = angular.element(column.find('select')[0]);
          });

          it('should be present in the DOM', function () {
            expect(select[0]).toBeDefined();
          });

          it('should be required', function () {
            expect(select.attr('required')).toBeTruthy();
          });

          it('should have the correct ng-model', function () {
            expect(select.attr('ng-model')).toEqual(
              'itemTax.itemTaxType');
          });

          it('should have a name', function () {
            expect(select.attr('name')).toEqual(
              'Applied Tax Type');
          });

          it('should contain a list of options', function () {
            expect(select.find('option').length).toEqual(4);
          });

          describe('options', function () {

            var grossOption,
              netOption,
              noneOption;

            beforeEach(function () {
              grossOption = angular.element(select.find('option')[1]);
              netOption = angular.element(select.find('option')[2]);
              noneOption = angular.element(select.find('option')[3]);
            });

            it('should be contain a gross option', function () {
              expect(grossOption[0]).toBeDefined();
            });

            it('should have a gross option with the correct label', function () {
              var expectedLabel = scope.appliedTaxTypes[0].name;
              expect(grossOption.text().trim()).toEqual(expectedLabel);
            });

            it('should be contain a net option', function () {
              expect(netOption[0]).toBeDefined();
            });

            it('should have a net option with the correct label', function () {
              var expectedLabel = scope.appliedTaxTypes[1].name;
              expect(netOption.text().trim()).toEqual(expectedLabel);
            });

            it('should be contain a none option', function () {
              expect(noneOption[0]).toBeDefined();
            });

            it('should have a none option with the correct label', function () {
              var expectedLabel = scope.appliedTaxTypes[2].name;
              expect(noneOption.text().trim()).toEqual(expectedLabel);
            });

          });

        });

      });

    });

  });

});
