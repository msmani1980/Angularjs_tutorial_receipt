'use strict';

describe('Directive: datePicker', function () {

  // load the directive's module
  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));

  var element;
  var scope;
  var companyFormatUtility;

  beforeEach(inject(function ($rootScope, $injector) {
    companyFormatUtility = $injector.get('companyFormatUtility');
    spyOn(companyFormatUtility, 'getDateFormat').and.returnValue('DD/MM/YYYY');
    scope = $rootScope.$new();
  }));

  describe('date picker', function () {
    beforeEach(inject(function ($compile) {
      element = angular.element(
        '<date-picker label-from="labelFrom" label-to="labelTo"></date-picker>'
      );
      element = $compile(element)(scope);
      scope.$digest();
    }));

    describe('dependencies', function () {
      it('should get the date format from companyFormatUtility', function () {
        expect(companyFormatUtility.getDateFormat).toHaveBeenCalled();
      });

    });

    it('should have 2 input fields', function () {
      expect(element.find('input').length).toBe(2);
    });

    it('should have label-from', function () {
      expect(element.find('.startDateContainer label').text()).toBe(
        'labelFrom');
    });

    it('should have label-from', function () {
      expect(element.find('.endDateContainer label').text()).toBe(
        'labelTo');
    });
  });
});
