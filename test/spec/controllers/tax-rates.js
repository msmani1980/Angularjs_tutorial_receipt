'use strict';

fdescribe('Controller: TaxRatesCtrl', function() {

  // load the controller's module, load in JSON
  beforeEach(module(
    'ts5App',
    'template-module',
    'served/tax-rate-types.json',
    'served/tax-types.json'
  ));

  var TaxRatesCtrl;
  var $scope;
  var controller;
  var compile;
  var templateCache;
  var taxRatesFactory;
  var taxTypesJSON;
  var taxRateTypesJSON;
  var getTaxTypesListDeferred;
  var getTaxRateTypesDeferred;

  beforeEach(inject(function($q, $controller, $rootScope, $injector, _servedTaxTypes_, _servedTaxRateTypes_) {
    taxTypesJSON = _servedTaxTypes_;
    taxRateTypesJSON = _servedTaxRateTypes_;

    $scope = $rootScope.$new();
    controller = $controller;

    templateCache = $injector.get('$templateCache');
    compile = $injector.get('$compile');
    taxRatesFactory = $injector.get('taxRatesFactory');

    getTaxTypesListDeferred = $q.defer();
    spyOn(taxRatesFactory, 'getTaxTypesList').and.returnValue(getTaxTypesListDeferred.promise);

    getTaxRateTypesDeferred = $q.defer();
    spyOn(taxRatesFactory, 'getTaxRateTypes').and.returnValue(getTaxRateTypesDeferred.promise);
  }));

  function resolveAllDependencies() {
    getTaxTypesListDeferred.resolve(taxTypesJSON);
    getTaxRateTypesDeferred.resolve(taxRateTypesJSON);
    $scope.$digest();
  }

  function initController() {
    TaxRatesCtrl = controller('TaxRatesCtrl', {
      $scope: $scope
    });
  }

  function mockInitController() {
    TaxRatesCtrl.init();
    $scope.$digest();
  }

  describe('When the Controller is rendered, it', function() {

    beforeEach(function() {
      initController();
    });

    it('should set the taxRateList as a blank array', function() {
      expect($scope.taxRatesList).toEqual([]);
    });

    it('should set the taxTypesList as a blank array', function() {
      expect($scope.taxTypesList).toEqual([]);
    });

    it('should set the taxTypesList as a blank array', function() {
      var mockDates = {
        startDate: '',
        endDate: ''
      };
      expect($scope.dateRange).toEqual(mockDates);
    });

  });

  describe('When the controller is Initialized, it', function() {

    beforeEach(function() {
      initController();
      resolveAllDependencies();

      spyOn(TaxRatesCtrl, 'showLoadingModal');
      spyOn(TaxRatesCtrl, 'hideLoadingModal');

      mockInitController();
    });

    it('should set the $scope.viewName to Tax Management', function() {
      expect($scope.viewName).toBe('Tax Management');
    });

    it('should display the loading modal, with specific text', function() {
      expect(TaxRatesCtrl.showLoadingModal).toHaveBeenCalledWith('Loading data for Tax Management...');
    });

    it('should hide the loading modal', function() {
      expect(TaxRatesCtrl.hideLoadingModal).toHaveBeenCalled();
    });

    it('should set the viewIsReady to true', function() {
      expect($scope.viewIsReady).toBeTruthy();
    });

    describe('After dependencies have been resolved, it', function() {

      it('should set the $scope.taxTypesList', function() {
        var mockList = [Object({
          id: 16,
          companyId: 326,
          taxTypeCode: 'GST',
          countTaxRate: '0',
          description: 'Goods and Service Tax'
        }), Object({
          id: 17,
          companyId: 326,
          taxTypeCode: 'Local',
          countTaxRate: '0',
          description: 'Local City Taxes'
        }), Object({
          id: 15,
          companyId: 326,
          taxTypeCode: 'VAT',
          countTaxRate: '0',
          description: 'Value Added Tax'
        })];
        expect($scope.taxTypesList).toEqual(mockList);
      });

      it('should set the $scope.taxRatesList', function() {
        var mockList = [Object({
          id: '1',
          taxRateType: 'Amount'
        }), Object({
          id: '2',
          taxRateType: 'Percentage'
        })];
        expect($scope.taxRatesList).toEqual(mockList);
      });

    });

  });

});
