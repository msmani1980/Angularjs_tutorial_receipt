'use strict';
/*global moment*/

describe('Controller: EmployeeCommissionListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/items-list.json', 'served/price-types.json', 'served/tax-rate-types.json', 'served/employee-commission-list.json'));


  var EmployeeCommissionListCtrl,
    employeeCommissionFactory,
    dateUtility,
    getItemsListDeferred,
    getPriceTypesListDeferred,
    getTaxRateTypesDeferred,
    getCommissionListDeferred,
    itemsListJSON,
    priceTypeListJSON,
    taxRateTypesJSON,
    employeeCommissionListJSON,
    scope;

  beforeEach(inject(function ($controller, $rootScope, $q, $injector) {
    inject(function (_servedItemsList_, _servedPriceTypes_, _servedTaxRateTypes_, _servedEmployeeCommissionList_) {
      itemsListJSON = _servedItemsList_;
      priceTypeListJSON = _servedPriceTypes_;
      taxRateTypesJSON = _servedTaxRateTypes_;
      employeeCommissionListJSON = _servedEmployeeCommissionList_;
    });

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(itemsListJSON);

    getPriceTypesListDeferred = $q.defer();
    getPriceTypesListDeferred.resolve(priceTypeListJSON);

    getTaxRateTypesDeferred = $q.defer();
    getTaxRateTypesDeferred.resolve(taxRateTypesJSON);

    getCommissionListDeferred = $q.defer();
    getCommissionListDeferred.resolve(employeeCommissionListJSON);

    dateUtility = $injector.get('dateUtility');
    employeeCommissionFactory = $injector.get('employeeCommissionFactory');
    spyOn(employeeCommissionFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getPriceTypesList').and.returnValue(getPriceTypesListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getTaxRateTypes').and.returnValue(getTaxRateTypesDeferred.promise);
    spyOn(employeeCommissionFactory, 'getCommissionList').and.returnValue(getCommissionListDeferred.promise);

    scope = $rootScope.$new();
    EmployeeCommissionListCtrl = $controller('EmployeeCommissionListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a viewName to the scope', function () {
    expect(scope.viewName).toBeDefined();
  });

  describe('search object', function () {

    it('should exists in scope', function () {
      expect(scope.search).toBeDefined();
    });

    it('should have required properties', function () {
      expect(Object.keys(scope.search)).toEqual(['startDate', 'endDate', 'itemsList', 'priceTypesList',
        'taxRateTypesList']);
    });

  });

  describe('API requests', function () {

    it('should fetch price type from factory', function () {
      expect(employeeCommissionFactory.getPriceTypesList).toHaveBeenCalled();
    });

    it('should fetch tax rate type from factory', function () {
      expect(employeeCommissionFactory.getTaxRateTypes).toHaveBeenCalled();
    });

    it('should fetch items with startDate and endDate from factory', function () {
      var expectedDate = moment().add(1, 'days').format('YYYYMMDD').toString();
      scope.search.startDate = moment().add(1, 'days').format('L').toString();
      scope.search.endDate = scope.search.startDate;
      scope.$digest();
      expect(employeeCommissionFactory.getItemsList).toHaveBeenCalledWith({startDate: expectedDate, endDate: expectedDate});
    });


    it('should fetch items with endDate from factory', function () {
      scope.search.startDate = '05/10/1979';
      scope.search.endDate = '05/10/1979';
      scope.$digest();
      expect(employeeCommissionFactory.getItemsList).toHaveBeenCalledWith({
        startDate: '19790510',
        endDate: '19790510'
      });
    });

    describe('getCommissionList', function () {

      it('should fetch commissions from factory', function () {
        expect(employeeCommissionFactory.getCommissionList).toHaveBeenCalled();
      });

      it('should attach commissionList to scope', function () {
        scope.$digest();
        expect(scope.commissionList).toBeDefined();
      });

      it('should change the dates to valid App Format', function () {
        scope.$digest();
        expect(dateUtility.isDateValidForApp(scope.commissionList[0].startDate)).toBe(true);
        expect(dateUtility.isDateValidForApp(scope.commissionList[0].endDate)).toBe(true);
      });

    });
  });


  describe('form reset', function () {

    beforeEach(function () {
      scope.search.selectedPriceType = 'fakeData';
      scope.search.selectedRateType = 'fakeData';
      scope.search.startDate = 'fakeData';
      scope.search.endDate = 'fakeData';
      scope.clearForm();
    });

    it('should reset the selected price type', function () {
      expect(scope.search.selectedPriceType).toBeUndefined();
    });

    it('should reset the selected rate type', function () {
      expect(scope.search.selectedRateType).toBeUndefined();
    });

    it('should reset the startDate', function () {
      expect(scope.search.startDate).toBe('');
    });

    it('should reset the endDate', function () {
      expect(scope.search.endDate).toBe('');
    });

  });

  describe('Search', function () {

    it('should have a searchCommissions function', function () {
      expect(scope.searchCommissions).toBeDefined();
    });

  });

});
