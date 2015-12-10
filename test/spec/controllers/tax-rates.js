'use strict';

describe('Controller: TaxRatesCtrl', function() {

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

  // Initialize the controller and a mock scope
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

  describe('When the page is initialized', function() {
    beforeEach(function() {
      initController();
      resolveAllDependencies();

      spyOn(TaxRatesCtrl, 'showLoadingModal');
      spyOn(TaxRatesCtrl, 'hideLoadingModal');

      mockInitController();
    });

    it('it should set the $scope.viewName to Tax Management', function() {
      expect($scope.viewName).toBe('Tax Management');
    });

    it('should display the loading modal', function() {
      expect(TaxRatesCtrl.showLoadingModal).toHaveBeenCalledWith('Loading data for Tax Management...');
    });

    it('should hide the loading modal', function() {
      expect(TaxRatesCtrl.hideLoadingModal).toHaveBeenCalled();
    });

  });

});
