'use strict';

describe('Controller: EmployeeCommissionEditCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/master-item-list.json', 'served/price-types.json', 'served/tax-rate-types.json', 'served/company-currency-globals.json'));


  var EmployeeCommissionEditCtrl,
    employeeCommissionFactory,
    getItemsListDeferred,
    getPriceTypesListDeferred,
    getTaxRateTypesDeferred,
    getCompanyCurrenciesDeferred,
    masterItemsListJSON,
    priceTypeListJSON,
    taxRateTypesJSON,
    companyCurrencyJSON,
    routeParams,
    scope;

  beforeEach(inject(function ($q, $controller, $rootScope, $injector, $routeParams) {
    inject(function (_servedMasterItemList_, _servedPriceTypes_, _servedTaxRateTypes_, _servedCompanyCurrencyGlobals_) {
      masterItemsListJSON = _servedMasterItemList_;
      priceTypeListJSON = _servedPriceTypes_;
      taxRateTypesJSON = _servedTaxRateTypes_;
      companyCurrencyJSON = _servedCompanyCurrencyGlobals_;
    });

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(masterItemsListJSON);

    getPriceTypesListDeferred = $q.defer();
    getPriceTypesListDeferred.resolve(priceTypeListJSON);

    getTaxRateTypesDeferred = $q.defer();
    getTaxRateTypesDeferred.resolve(taxRateTypesJSON);

    getCompanyCurrenciesDeferred = $q.defer();
    getCompanyCurrenciesDeferred.resolve(companyCurrencyJSON);

    employeeCommissionFactory = $injector.get('employeeCommissionFactory');
    spyOn(employeeCommissionFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getPriceTypesList').and.returnValue(getPriceTypesListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getTaxRateTypes').and.returnValue(getTaxRateTypesDeferred.promise);
    spyOn(employeeCommissionFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrenciesDeferred.promise);
    spyOn(employeeCommissionFactory, 'createCommission').and.returnValue(getCompanyCurrenciesDeferred.promise);

    scope = $rootScope.$new();
    routeParams = $routeParams;
    EmployeeCommissionEditCtrl = $controller('EmployeeCommissionEditCtrl', {
      $scope: scope
    });
    scope.employeeCommissionForm = {
      $valid: true
    };
    scope.$digest();
  }));

  describe('initialize', function () {

    it('should have a list of items attached to scope', function () {
      expect(scope.itemsList).toBeDefined();
    });

    it('should have a list of price types attached to scope', function () {
      expect(scope.priceTypesList).toBeDefined();
    });

    it('should have a list of price types attached to scope', function () {
      expect(scope.taxRateTypes).toBeDefined();
    });

    it('should have a list of currencies attached to scope', function () {
      expect(scope.companyCurrencies).toBeDefined();
    });
  });

  describe('submit form', function () {
    var expectedPayload;

    beforeEach(function () {

      scope.commission = {
        startDate: '05/10/2020',
        endDate: '05/10/2055',
        currenciesFields: {},
        selectedItem: {
          id: 1
        },
        selectedPriceType: {
          id: 1
        }
      };

      expectedPayload = {
        employeeCommission: {
          startDate: '20200510',
          endDate: '20550510',
          itemMasterId: scope.commission.selectedItem.id,
          types: [{priceTypeId: scope.commission.selectedPriceType.id}]
        }
      };

    });

    it('should not call API if form is not valid', function () {
      scope.employeeCommissionForm.$valid = false;
      scope.submitForm();
      scope.$digest();

      expect(employeeCommissionFactory.createCommission).not.toHaveBeenCalled();
    });

    it('should add percentage to payload if percentage selected', function () {
      scope.commission.selectedRateType = {taxRateType: 'Percentage'};
      scope.commission.percentage = 1.66;
      expectedPayload.employeeCommission.percentage = scope.commission.percentage;

      scope.submitForm();
      scope.$digest();

      expect(employeeCommissionFactory.createCommission).toHaveBeenCalledWith(expectedPayload);
    });

    it('should add currencies to payload if Amount selected', function () {
      scope.commission.selectedRateType = {taxRateType: 'Amount'};
      expectedPayload.employeeCommission.fixeds = [];

      angular.forEach(scope.companyCurrencies, function (currency) {
        var currencyValue = 10.05;
        expectedPayload.employeeCommission.fixeds.push({
          fixedValue: currencyValue,
          currencyId: currency.id
        });
        scope.commission.currenciesFields[currency.code] = currencyValue;
      });

      scope.submitForm();
      scope.$digest();

      expect(employeeCommissionFactory.createCommission).toHaveBeenCalledWith(expectedPayload);
    });

  });

  describe('view/edit commission', function () {
    it('should have a function to determine if commission is readOnly', function () {
      expect(scope.isCommissionReadOnly).toBeDefined();
    });

    it('should return false if creating new commission', function () {
      routeParams = {state: 'create'};
      expect(scope.isCommissionReadOnly()).toBe(false);
    });

    it('should return true if editing and starDate in the past', function () {
      routeParams = {state: 'edit'};
      scope.commission = {startDate: '05/10/1979'};
      expect(scope.isCommissionReadOnly()).toBe(true);
    });

    it('should return false if editing and startDate in the future', function () {
      routeParams = {state: 'edit'};
      scope.commission = {startDate: '05/10/2079'};
      expect(scope.isCommissionReadOnly()).toBe(false);
    });

    it('should return false if viewing and startDate in the future', function () {
      routeParams = {state: 'view'};
      scope.commission = {startDate: '05/10/2079'};
      expect(scope.isCommissionReadOnly()).toBe(true);
    });
  })

});
