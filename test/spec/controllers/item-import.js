'use strict';

describe('Controller: ItemImportCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/stockowner-companies.json'));

  var ItemImportCtrl,
    scope,
    ItemImportFactory,
    stockownerCompaniesResponseJSON,
    getCompaniesListDeferred;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $q, _ItemImportFactory_) {
    scope = $rootScope.$new();

    inject(function (_servedStockownerCompanies_) {
      stockownerCompaniesResponseJSON = _servedStockownerCompanies_;
    });

    ItemImportFactory = _ItemImportFactory_;

    getCompaniesListDeferred = $q.defer();
    getCompaniesListDeferred.resolve(stockownerCompaniesResponseJSON);
    spyOn(ItemImportFactory, 'getCompaniesList').and.returnValue(getCompaniesListDeferred.promise);

    ItemImportCtrl = $controller('ItemImportCtrl', {
      $scope: scope
    });
    scope.$digest();
  }));



  describe('scope globals', function(){
    it('should attach a viewName to the scope', function () {
      expect(scope.viewName).toBe('Import Stock Owner Items');
    });
  });
/*
  describe('itemImportFactory API calls', function(){
    it('should call getCompaniesList', function () {
      expect(itemImportFactory.getCompaniesList).toHaveBeenCalled();
    });
    /*
    it('should have company attached to scope after API call', function () {
      expect(scope.company).toBeDefined();
    });
    */
  //});


});
