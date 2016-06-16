'use strict';

describe('The Date Picker Field directive', function () {

  // load the directive's module
  beforeEach(module('ts5App'));

  beforeEach(module('template-module'));

  var element;
  var $scope;
  var formGroup;
  var companyFormatUtility;

  beforeEach(inject(function ($rootScope, $injector) {
    companyFormatUtility = $injector.get('companyFormatUtility');
    spyOn(companyFormatUtility, 'getDateFormat').and.returnValue('DD/MM/YYYY');

    $scope = $rootScope.$new();
  }));

  function generateDirectiveTemplate(config) {
    var template = '<date-picker-field ';
    if (config.form) {
      template += 'form="' + config.form + '" ';
    }

    if (config.label) {
      template += 'label="' + config.label + '" ';
    }

    if (config.name) {
      template += 'name="' + config.name + '" ';
    }

    if (config.ngModel) {
      template += 'ng-model="' + config.ngModel + '" ';
    }

    if (config.required) {
      template += 'required="' + config.required + '" ';
    }

    if (config.disablePast) {
      template += 'disable-past="' + config.disablePast + '" ';
    }

    if (config.placeholder) {
      template += 'placeholder="' + config.placeholder + '" ';
    }

    if (config.placeholder) {
      template += 'orientation="' + config.orientation + '" ';
    }

    template += '></date-picker-field>';
    return template;
  }

  function renderDirective(config, $compile) {
    var template = generateDirectiveTemplate(config);
    element = angular.element(template);
    element = $compile(element)($scope);
    $scope.$digest();
    formGroup = angular.element(element.find('.form-group')[0]);
  }

  describe('when the directive is rendered', function () {

    var config;
    beforeEach(inject(function ($compile) {
      config = {
        form: 'form',
        ngModel: 'formData.startDate',
        label: 'Effective From',
        name: 'EffectiveFrom',
        required: true,
        disablePast: true
      };
      renderDirective(config, $compile);
    }));

    describe('dependencies', function () {
      it('should get the date format from companyFormatUtility', function () {
        expect(companyFormatUtility.getDateFormat).toHaveBeenCalled();
      });

    });

    it('should set the form attribute on the directive', function () {
      expect(element.attr('form')).toEqual(config.form);
    });

    it('should set the ng-model attribute on the directive', function () {
      expect(element.attr('ng-model')).toEqual(config.ngModel);
    });

    it('should set the label attribute on the directive', function () {
      expect(element.attr('label')).toEqual(config.label);
    });

    it('should set the label attribute on the directive', function () {
      expect(element.attr('name')).toEqual(config.name);
    });

    it('should set the disable-past attribute on the directive', function () {
      expect(element.attr('disable-past')).toEqual(config.disablePast.toString());
    });

    it('should set the required attribute on the directive', function () {
      if (config.required) {
        expect(element.attr('required')).toEqual('required');
      }
    });

    it('should set the placeholder attribute on the directive', function () {
      if (config.placeholder) {
        expect(element.attr('placeholder')).toEqual('placeholder');
      }
    });

    it('should set the placeholder attribute on the directive', function () {
      if (config.placeholder) {
        expect(element.attr('orientation')).toEqual('orientation');
      }
    });

    it('should be wrapped in a form-group', function () {
      expect(formGroup).toBeDefined();
    });

    describe('label element', function () {
      var label;
      beforeEach(function () {
        label = angular.element(formGroup.find('label')[0]);
      });

      it('should be present in the DOM', function () {
        expect(label).toBeDefined();
      });

      describe('required span label', function () {
        var span;
        beforeEach(function () {
          span = angular.element(label.find('span')[0]);
        });

        it('should be present in the DOM', function () {
          expect(span).toBeDefined();
        });

        it('should have a .required class', function () {
          expect(span.hasClass('required')).toBeTruthy();
        });

        it(
          'should have a ng-show attribute that shows the span if the field is required',
          function () {
            expect(span.attr('ng-show')).toEqual('required');
          });

        it('should have a * display in the span', function () {
          expect(span.text()).toEqual('*');
        });

      });

    });

    describe('input group', function () {
      var inputGroup;
      beforeEach(function () {
        inputGroup = angular.element(formGroup.find(
          '.input-group')[0]);
      });

      it('should be present in the DOM', function () {
        expect(inputGroup).toBeDefined();
      });

      describe('input group button element', function () {
        var inputGroupBtn,
          button;
        beforeEach(function () {
          inputGroupBtn = angular.element(inputGroup.find(
            '.input-group-btn')[0]);
          button = angular.element(inputGroupBtn.find(
            'span')[0]);
        });

        it('should be present in the DOM', function () {
          expect(inputGroupBtn).toBeDefined();
        });

        describe('button', function () {
          var button;
          beforeEach(function () {
            button = angular.element(inputGroupBtn.find(
              '.btn')[0]);
          });

          it('should be present in the DOM', function () {
            expect(button).toBeDefined();
          });

          it('should have a .btn class', function () {
            expect(button.hasClass('btn')).toBeTruthy();
          });

          it('should have a .btn-default class', function () {
            expect(button.hasClass('btn-default')).toBeTruthy();
          });

          it('should contain an icon', function () {
            expect(button.find('i').hasClass(
              'glyphicon-calendar')).toBeTruthy();
          });

        });

      });

      describe('input', function () {
        var input;
        beforeEach(function () {
          input = angular.element(inputGroup.find('input')[
            0]);
        });

        it('should be present in the DOM', function () {
          expect(input).toBeDefined();
        });

        it('should be a text input', function () {
          expect(input.attr('type')).toEqual('text');
        });

        it('should have a .form-control class', function () {
          expect(input.hasClass('form-control')).toBeTruthy();
        });

        it('should have the model set to ngModel', function () {
          expect(input.attr('ng-model')).toEqual('ngModel');
        });

      });

    });

  });

});
