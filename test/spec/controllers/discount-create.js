'use strict';

fdescribe('Controller: DiscountCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-discount-types.json'));
  beforeEach(module('served/discount-types.json'));
  beforeEach(module('served/company-currency-globals.json'));
  beforeEach(module('served/sales-categories.json'));
  beforeEach(module('served/master-item-list.json'));

  var DiscountCreateCtrl,
    scope,
    discountFactory,
    recordsService,
    currencyFactory,
    companiesFactory,
    itemsFactory,
    getCompanyDiscountTypesListDeferred,
    getCompanyCurrencyGlobalsDeferred,
    getDiscountTypesListDeferred,
    getSalesCategoriesListDeferred,
    getRetailItemsMasterListDeferred,
    companyDiscountTypesListJSON,
    discountTypesListJSON,
    companyCurrencyGlobalsListJSON,
    salesCategoriesListJSON,
    masterItemListJSON;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($q, $controller, $rootScope, _discountFactory_, _recordsService_, _currencyFactory_, _companiesFactory_, _itemsFactory_) {
    inject(function (_servedCompanyDiscountTypes_, _servedDiscountTypes_, _servedSalesCategories_, _servedCompanyCurrencyGlobals_, _servedMasterItemList_) {
      companyDiscountTypesListJSON = _servedCompanyDiscountTypes_;
      discountTypesListJSON = _servedDiscountTypes_;
      salesCategoriesListJSON = _servedSalesCategories_;
      companyCurrencyGlobalsListJSON = _servedCompanyCurrencyGlobals_;
      masterItemListJSON = _servedMasterItemList_;
    });

    scope = $rootScope.$new();
    discountFactory = _discountFactory_;
    recordsService = _recordsService_;
    currencyFactory = _currencyFactory_;
    companiesFactory = _companiesFactory_;
    itemsFactory = _itemsFactory_;

    getCompanyDiscountTypesListDeferred = $q.defer();
    getCompanyDiscountTypesListDeferred.resolve(companyDiscountTypesListJSON);

    getDiscountTypesListDeferred = $q.defer();
    getDiscountTypesListDeferred.resolve(discountTypesListJSON);

    getCompanyCurrencyGlobalsDeferred = $q.defer();
    getCompanyCurrencyGlobalsDeferred.resolve(companyCurrencyGlobalsListJSON);

    getSalesCategoriesListDeferred = $q.defer();
    getSalesCategoriesListDeferred.resolve(salesCategoriesListJSON);

    getRetailItemsMasterListDeferred = $q.defer();
    getRetailItemsMasterListDeferred.resolve(masterItemListJSON);

    spyOn(discountFactory, 'getDiscountTypesList').and.returnValue(getCompanyDiscountTypesListDeferred.promise);
    spyOn(recordsService, 'getDiscountTypes').and.returnValue(getDiscountTypesListDeferred.promise);
    spyOn(currencyFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrencyGlobalsDeferred.promise);
    spyOn(companiesFactory, 'getSalesCategoriesList').and.returnValue(getSalesCategoriesListDeferred.promise);
    spyOn(itemsFactory, 'getItemsList').and.returnValue(getRetailItemsMasterListDeferred.promise);

    DiscountCreateCtrl = $controller('DiscountCreateCtrl', {
      $scope: scope
    });
  }));

  it('getCleanFormData should reset form data', function() {

  });

  it('checkFormState should change page labels on editing', function() {

  });

  describe('the determine minimum date functionality', function() {

    beforeEach(function() {
      scope.formData = DiscountCreateCtrl.getCleanFormData();
      spyOn(DiscountCreateCtrl, 'determineMinDate').and.callThrough();
      scope.$digest();
    });

    it('should determine the min date on success', function() {
      expect(DiscountCreateCtrl.determineMinDate).toHaveBeenCalled();
    });

    it('should set the minDate in the scope', function() {
      expect(scope.minDate).toEqual(DiscountCreateCtrl.determineMinDate());
    });

    it('should return a formatted string', function() {
      var dateStringControl = '+1d';
      var dateStringTest = DiscountCreateCtrl.determineMinDate();
      expect(dateStringTest).toEqual(dateStringControl);
    });
  });

  it('setUIReady should mark page as ready', function() {

  });

  it('setGlobalDiscountTypesList should set global discount types', function() {

  });

  it('setDiscountTypesList should set discount types', function() {

  });

  it('setCompanyCurrencyGlobals should set company currency globals', function() {

  });

  it('setSalesCategoriesListAndMap should set sales categories', function() {

  });

  it('setRetailItemsList should set retail item list', function() {

  });

  it('setDefaultRetailItems should set default retail item', function() {

  });

  describe('getItem should', function() {
    it('get the discount', function() {

    });
    it('update form data', function() {

    });
    it('set ui ready', function() {

    });
  });

  it('setDependencies should set all dependencies', function() {

  });

  it('getDependencies should get all dependencies', function() {

  });

  describe('deserialize should', function() {
    it('deserialize discount information', function() {

    });
    it('deserialize benefits', function() {

    });
    it('deserialize limitation per shop', function() {

    });
    it('deserialize limitation per transaction', function() {

    });
    it('deserialize limitation per seat', function() {

    });
    it('deserialize restrictions', function() {

    });
  });

  it('updateFormData should call all deserialize methods', function() {

  });

  describe('serialize should', function() {
    it('serialize discount information', function() {

    });
    it('serialize benefits', function() {

    });
    it('serialize limitation per shop', function() {

    });
    it('serialize limitation per transaction', function() {

    });
    it('serialize limitation per seat', function() {

    });
    it('serialize restrictions', function() {

    });
  });

  it('formatPayload should call all serialize methods', function() {

  });

  it('showDeleteConfirmation should set restrictedItemToDelete', function() {

  });

  it('deleteRestrictedItem should delete restricted item', function() {

  });

  it('addRestrictedItems should add restricted item', function() {

  });

  it('getGlobalDiscountDescriptionById should get global discount description by id', function() {

  });

  it('getRetailItemNameById should get retail item name by id', function() {

  });

  it('loadRestrictedItemsByCategory should load restricted items by category', function() {

  });

  it('checkIfDiscountIsActive should check if discount is active', function() {

  });

  it('checkIfDiscountIsInactive should check if discount is inactive', function() {

  });

  it('isDisabled should check if discount is disabled', function() {

  });

  it('updateItem should update item', function() {

  });

  it('createItem should update item', function() {

  });



});
