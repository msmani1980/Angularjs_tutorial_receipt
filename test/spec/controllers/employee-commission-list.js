'use strict';
/*global moment*/

describe('Controller: EmployeeCommissionListCtrl', function () {

  beforeEach(module('ts5App'));
  beforeEach(module('served/items-list.json', 'served/price-types.json', 'served/tax-rate-types.json', 'served/employee-commission-list.json', 'served/sales-categories.json'));


  var EmployeeCommissionListCtrl,
    employeeCommissionFactory,
    dateUtility,
    getItemsListDeferred,
    getPriceTypesListDeferred,
    getTaxRateTypesDeferred,
    getCommissionListDeferred,
    salesCategoriesDeferred,
    salesCategoriesJSON,
    itemListJSON,
    priceTypeListJSON,
    taxRateTypesJSON,
    employeeCommissionListJSON,
    location,
    scope;

  beforeEach(inject(function ($controller, $rootScope, $q, $injector, $location) {
    location = $location;
    inject(function (_servedItemsList_, _servedPriceTypes_, _servedTaxRateTypes_, _servedEmployeeCommissionList_, _servedSalesCategories_) {
      itemListJSON = _servedItemsList_;
      priceTypeListJSON = _servedPriceTypes_;
      taxRateTypesJSON = _servedTaxRateTypes_;
      employeeCommissionListJSON = _servedEmployeeCommissionList_;
      salesCategoriesJSON = _servedSalesCategories_;
    });

    getItemsListDeferred = $q.defer();
    getItemsListDeferred.resolve(itemListJSON);

    getPriceTypesListDeferred = $q.defer();
    getPriceTypesListDeferred.resolve(priceTypeListJSON);

    getTaxRateTypesDeferred = $q.defer();
    getTaxRateTypesDeferred.resolve(taxRateTypesJSON);

    getCommissionListDeferred = $q.defer();
    getCommissionListDeferred.resolve(employeeCommissionListJSON);

    salesCategoriesDeferred = $q.defer();
    salesCategoriesDeferred.resolve(salesCategoriesJSON);

    dateUtility = $injector.get('dateUtility');
    employeeCommissionFactory = $injector.get('employeeCommissionFactory');
    spyOn(employeeCommissionFactory, 'getItemsList').and.returnValue(getItemsListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getPriceTypesList').and.returnValue(getPriceTypesListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getTaxRateTypes').and.returnValue(getTaxRateTypesDeferred.promise);
    spyOn(employeeCommissionFactory, 'getCommissionList').and.returnValue(getCommissionListDeferred.promise);
    spyOn(employeeCommissionFactory, 'deleteCommission').and.returnValue(getCommissionListDeferred.promise);
    spyOn(employeeCommissionFactory, 'getItemsCategoriesList').and.returnValue(salesCategoriesDeferred.promise);


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
      expect(Object.keys(scope.search)).toEqual(['startDate', 'endDate', 'itemList', 'priceTypeList',
        'taxRateTypesList', 'selectedCategory']);
    });

  });

  describe('API requests', function () {

    it('should fetch price type from factory', function () {
      expect(employeeCommissionFactory.getPriceTypesList).toHaveBeenCalled();
    });

    it('should fetch tax rate type from factory', function () {
      expect(employeeCommissionFactory.getTaxRateTypes).toHaveBeenCalled();
    });


    it('should fetch items with endDate from factory', function () {
      scope.search.startDate = '05/10/1979';
      scope.search.endDate = '05/10/1979';
      scope.search.selectedCategory = {name: 'testCategory'};
      scope.$digest();
      expect(employeeCommissionFactory.getItemsList).toHaveBeenCalledWith({
        startDate: '19790510',
        endDate: '19790510',
        categoryName: 'testCategory'
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

      it('should have a rateTypeName property defined', function(){
        scope.$digest();
        expect(!!scope.commissionList[4].priceTypeName).toBe(true);
      });

      it('should have a taxRateTypeName property defined', function(){
        scope.$digest();
        expect(!!scope.commissionList[4].taxRateTypeName).toBe(true);
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

    beforeEach(function () {
      scope.search = {
        selectedItem: {itemMasterId: 1},
        selectedPriceType: {id: 2},
        selectedRateType: {taxRateType: 'Amount'},
        startDate: '07/20/2015',
        endDate: '08/30/2016'
      };
    });

    it('should have a searchCommissions function', function () {
      expect(scope.searchCommissions).toBeDefined();
    });

    it('should call getEmployeeCommissionList', function(){
      scope.search = {};
      scope.searchCommissions();
      expect(employeeCommissionFactory.getCommissionList).toHaveBeenCalled();
    });

    it('should format search payload', function () {
      var expectedPayload = {
        itemId: 1,
        priceTypeId: 2,
        isFixed: true,
        startDate: '20150720',
        endDate: '20160830'
      };
      scope.searchCommissions();
      expect(employeeCommissionFactory.getCommissionList).toHaveBeenCalledWith(expectedPayload);
    });

    it('should clear search payload with clearForm', function () {
      scope.clearForm();
      var clearedSearch = {
        startDate: '',
        endDate: ''
      };
      expect(scope.search).toEqual(clearedSearch);
    });
  });

  describe('Action buttons', function () {
    var fakeCommissionObject;

    beforeEach(function () {
      fakeCommissionObject = {
        endDate: moment().add(1, 'month').format('L').toString(),
        startDate: moment().format('L').toString()
      };
    });

    it('should change the url based on the commission object for view', function () {
      scope.showCommission({
        id: 1
      });
      scope.$digest();
      expect(location.path()).toBe('/employee-commission/view/1');
    });

    it('should change the url based on the commission object for edit', function () {
      scope.editCommission({
        id: 2
      });
      scope.$digest();
      expect(location.path()).toBe('/employee-commission/edit/2');
    });

    describe('can user edit / delete commission', function () {
      it('should have a isCommissionEditable function', function () {
        expect(!!scope.isCommissionEditable).toBe(true);
      });

      it('should return true if commission is editable', function () {
        expect(scope.isCommissionEditable(fakeCommissionObject)).toBe(true);
      });

      it('should return false if commission is not editable', function () {
        fakeCommissionObject.endDate = moment().subtract(1, 'month').format('L').toString();
        expect(scope.isCommissionEditable(fakeCommissionObject)).toBe(false);
      });

      it('should have a isCommissionReadOnly function', function () {
        expect(!!scope.isCommissionReadOnly).toBe(true);
      });

      it('should return true if startDate < today > endDate',
        function () {
          fakeCommissionObject.startDate = moment().subtract(1, 'month').format('L').toString();
          fakeCommissionObject.endDate = moment().subtract(2, 'month').format('L').toString();
          expect(scope.isCommissionReadOnly(fakeCommissionObject)).toBe(true);
        });

      it('should return true if startDate < today < endDate',
        function () {
          fakeCommissionObject.startDate = moment().subtract(1, 'month').format('L').toString();
          fakeCommissionObject.endDate = moment().add(2, 'month').format('L').toString();
          expect(scope.isCommissionReadOnly(fakeCommissionObject)).toBe(true);
        });

      it('should return false if startDate > today > endDate',
        function () {
          fakeCommissionObject.startDate = moment().add(1, 'month').format('L').toString();
          fakeCommissionObject.endDate = moment().add(2, 'month').format('L').toString();
          expect(scope.isCommissionReadOnly(fakeCommissionObject)).toBe(false);
        });
      it('should return true if commission === null or undefined',
        function () {
          expect(scope.isCommissionReadOnly(fakeCommissionObject)).toBe(true);
        });
    });

    it('should have a confirmDelete function', function () {
      expect(!!scope.showDeleteConfirmation).toBe(true);
    });

    it('should attach commissionToDelete to scope', function () {
      scope.showDeleteConfirmation({
        name: 'commissionToDelete'
      });
      expect(scope.commissionToDelete.name).toBe('commissionToDelete');
    });

    it('should do a DELETE request to commissionService with commissionToDelete',
      function () {
        scope.showDeleteConfirmation({
          id: '1'
        });
        scope.deleteCommission();
        expect(employeeCommissionFactory.deleteCommission).toHaveBeenCalled();
      });

  });

});
