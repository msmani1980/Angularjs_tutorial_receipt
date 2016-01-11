'use strict';

describe('Controller: DiscountCreateCtrl', function () {

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
    $location,
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
  beforeEach(inject(function ($q, _$location_, $controller, $rootScope, _discountFactory_, _recordsService_, _currencyFactory_, _companiesFactory_, _itemsFactory_) {
    inject(function (_servedCompanyDiscountTypes_, _servedDiscountTypes_, _servedSalesCategories_, _servedCompanyCurrencyGlobals_, _servedMasterItemList_) {
      companyDiscountTypesListJSON = _servedCompanyDiscountTypes_;
      discountTypesListJSON = _servedDiscountTypes_;
      salesCategoriesListJSON = _servedSalesCategories_;
      companyCurrencyGlobalsListJSON = _servedCompanyCurrencyGlobals_;
      masterItemListJSON = _servedMasterItemList_;
    });

    scope = $rootScope.$new();
    $location = _$location_;
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
    spyOn(discountFactory, 'getDiscount').and.returnValue(getCompanyDiscountTypesListDeferred.promise);
    spyOn(recordsService, 'getDiscountTypes').and.returnValue(getDiscountTypesListDeferred.promise);
    spyOn(currencyFactory, 'getCompanyCurrencies').and.returnValue(getCompanyCurrencyGlobalsDeferred.promise);
    spyOn(companiesFactory, 'getSalesCategoriesList').and.returnValue(getSalesCategoriesListDeferred.promise);
    spyOn(itemsFactory, 'getItemsList').and.returnValue(getRetailItemsMasterListDeferred.promise);
    spyOn(discountFactory, 'updateDiscount').and.callThrough();
    spyOn(discountFactory, 'createDiscount').and.callThrough();

    DiscountCreateCtrl = $controller('DiscountCreateCtrl', {
      $scope: scope,
      $routeParams: { id: 1 }
    });
  }));

  it('getCleanFormData should reset form data', function() {
    var expected = {
      isRestriction: false,
      restrictedCategories: [],
      restrictedItems: [],
      amountDiscountValue: {},
      amountLimitPerShopValue: {},
      amountLimitPerTransactionValue: {}
    };

    expect(DiscountCreateCtrl.getCleanFormData()).toEqual(expected);
  });

  describe('checkFormState should', function() {
    it('show create labels on creation', function() {
      spyOn($location, 'path').and.returnValue('/discounts/create');

      DiscountCreateCtrl.checkFormState();

      expect(scope.editingDiscount).toEqual(false);
      expect(scope.viewName).toEqual('Create Discount');
      expect(scope.buttonText).toEqual('Create');
    });

    it('show edit labels labels on editing', function() {
      spyOn($location, 'path').and.returnValue('/discounts/edit');

      DiscountCreateCtrl.checkFormState();

      expect(scope.editingDiscount).toEqual(true);
      expect(scope.viewName).toEqual('Edit Discount');
      expect(scope.buttonText).toEqual('Save');
    });

  });

  it('setUIReady should mark page as ready', function() {
    DiscountCreateCtrl.setUIReady();

    expect(scope.uiSelectTemplateReady).toEqual(true);
  });

  it('setGlobalDiscountTypesList should set global discount types', function() {
    var payload = { discounts: [{ id: 1 }] };
    DiscountCreateCtrl.setGlobalDiscountTypesList(payload);

    expect(scope.globalDiscountTypesList).toEqual([{ id: 1 }]);
  });

  it('setDiscountTypesList should set discount types', function() {
    var payload = [{ id: 1 }];
    DiscountCreateCtrl.setDiscountTypesList(payload);

    expect(scope.discountTypesList).toEqual([{ id: 1 }]);
  });

  it('setCompanyCurrencyGlobals should set company currency globals', function() {
    var payload = { response: [{ id: 1 }] };
    DiscountCreateCtrl.setCompanyCurrencyGlobals(payload);

    expect(scope.companyCurrencyGlobalsList).toEqual([{ id: 1 }]);
  });

  it('setSalesCategoriesListAndMap should set sales categories', function() {
    var payload = { salesCategories: [{ id: 1 }] };
    DiscountCreateCtrl.setSalesCategoriesListAndMap(payload);

    expect(scope.salesCategoriesList).toEqual([{ id: 0, name: 'All' }, { id: 1 }]);
  });

  it('setRetailItemsList should set retail item list', function() {
    var payload = { masterItems: [{ id: 1 }] };
    DiscountCreateCtrl.setRetailItemsList(payload);

    expect(scope.retailItemsList).toEqual([{ id: 1 }]);
  });

  it('setDefaultRetailItems should set default retail item', function() {
    scope.retailItemsList = { id: 1 };
    DiscountCreateCtrl.setDefaultRetailItems();

    expect(scope.filteredRetailItemsList[0]).toEqual({ id: 1 });
  });

  describe('getDiscount should', function() {
    beforeEach(function() {
      spyOn(DiscountCreateCtrl, 'updateFormData');
      spyOn(DiscountCreateCtrl, 'setUIReady');
      DiscountCreateCtrl.getDiscount(1);
    });

    it('get the discount', function() {
      expect(discountFactory.getDiscount).toHaveBeenCalledWith(1);
    });
  });

  describe('deserialize should', function() {
    beforeEach(function() {
      scope.discountData = {
        name: 'name',
        discountTypeId: 1,
        barcode: 2,
        description: 'description',
        startDate: '20150101',
        endDate: '20160101',
        rateTypeId: 3,
        percentage: 4,
        rates: [{ amount: 5, companyCurrencyId: 6 }],
        itemQuantityLimitByShop: 7,
        limitsByShop: [{ amount: 8, companyCurrencyId: 9 }],
        itemQuantityLimitByTransaction: 10,
        limitsByTransaction: [{ amount: 11, companyCurrencyId: 12 }],
        seatNumberRequired: true,
        itemQuantityLimitBySeatNumber: 13,
        companyDiscountRestrictions: true
      };
    });

    it('deserialize discount information', function() {
      DiscountCreateCtrl.deserializeDiscountInformation(scope.discountData);

      expect(scope.formData.discountName).toEqual('name');
      expect(scope.formData.globalDiscountTypeId).toEqual(1);
      expect(scope.formData.barCode).toEqual(2);
      expect(scope.formData.description).toEqual('description');
      expect(scope.formData.startDate).toEqual('01/01/2015');
      expect(scope.formData.endDate).toEqual('01/01/2016');
    });

    it('deserialize benefits', function() {
      DiscountCreateCtrl.deserializeBenefits(scope.discountData);

      expect(scope.formData.discountTypeId).toEqual(3);
      expect(scope.formData.percentageDiscountValue).toEqual(4);
      expect(scope.formData.amountDiscountValue[6]).toEqual(5);

    });

    it('deserialize limitation per shop', function() {
      DiscountCreateCtrl.deserializeLimitationPerShop(scope.discountData);

      expect(scope.formData.itemQtyLimitPerShop).toEqual(7);
      expect(scope.formData.isAmountLimitPerShop).toEqual(true);
      expect(scope.formData.amountLimitPerShopValue[9]).toEqual(8);
    });

    it('deserialize limitation per transaction', function() {
      DiscountCreateCtrl.deserializeLimitationPerTransaction(scope.discountData);

      expect(scope.formData.itemQtyLimitPerTransaction).toEqual(10);
      expect(scope.formData.isAmountLimitPerTransaction).toEqual(true);
      expect(scope.formData.amountLimitPerTransactionValue[12]).toEqual(11);
    });

    it('deserialize limitation per seat', function() {
      DiscountCreateCtrl.deserializeLimitationPerSeat(scope.discountData);

      expect(scope.formData.requireSeatEntry).toEqual(true);
      expect(scope.formData.itemQtyLimitPerSeat).toEqual(13);
    });

    it('deserialize restrictions', function() {
      DiscountCreateCtrl.deserializeRestrictions(scope.discountData);

      expect(scope.formData.isRestriction).toEqual(true);
    });
  });

  describe('serialize should', function() {
    beforeEach(function() {
      scope.formData = {
        discountName: 'name',
        globalDiscountTypeId: 1,
        barCode: 2,
        description: 'description',
        startDate: '01/01/2015',
        endDate: '01/01/2016',
        discountTypeId: 3,
        percentageDiscountValue: 4,
        amountDiscountValue: { 6: 5 },
        itemQtyLimitPerShop: 7,
        amountLimitPerShopValue: { 10: 9 },
        itemQtyLimitPerTransaction: 10,
        amountLimitPerTransactionValue: { 11: 12 },
        requireSeatEntry: true,
        itemQtyLimitPerSeat: 13,
        isRestriction: true
      };
    });

    it('serialize discount information', function() {
      var discount = {};

      DiscountCreateCtrl.serializeDiscountInformation(scope.formData, discount);

      expect(discount.name).toEqual('name');
      expect(discount.discountTypeId).toEqual(1);
      expect(discount.barcode).toEqual(2);
      expect(discount.description).toEqual('description');
      expect(discount.startDate).toEqual('20150101');
      expect(discount.endDate).toEqual('20160101');
    });

    it('serialize benefits', function() {
      var discount = { rates: [] };

      DiscountCreateCtrl.serializeBenefits(scope.formData, discount);

      expect(discount.rateTypeId).toEqual(3);
      expect(discount.percentage).toEqual(4);
      expect(discount.rates).toEqual([{ amount: 5, companyCurrencyId: '6' }]);
    });

    it('serialize limitation per shop', function() {
      var discount = { limitsByShop: [] };

      DiscountCreateCtrl.serializeLimitationPerShop(scope.formData, discount);

      expect(discount.itemQuantityLimitByShop).toEqual(7);
      expect(discount.limitsByShop).toEqual([{ amount: 9, companyCurrencyId: '10' }]);
    });

    it('serialize limitation per transaction', function() {
      var discount = { limitsByTransaction: [] };

      DiscountCreateCtrl.serializeLimitationPerTransaction(scope.formData, discount);

      expect(discount.itemQuantityLimitByTransaction).toEqual(10);
      expect(discount.limitsByTransaction).toEqual([{ amount: 12, companyCurrencyId: '11' }]);
    });

    it('serialize limitation per seat', function() {
      var discount = {};

      DiscountCreateCtrl.serializeLimitationPerSeat(scope.formData, discount);

      expect(discount.seatNumberRequired).toEqual(true);
      expect(discount.itemQuantityLimitBySeatNumber).toEqual(13);
    });

    it('serialize restrictions', function() {
      var discount = {};

      DiscountCreateCtrl.serializeRestrictions(scope.formData, discount);

      expect(discount.companyDiscountRestrictions).toEqual(true);
    });
  });

  it('showDeleteConfirmation should set restrictedItemToDelete', function() {
    scope.showDeleteConfirmation(0, { name: 'name' });

    expect(scope.restrictedItemToDelete).toEqual({ rowIndex: 0, name: 'name' });
  });

  it('deleteRestrictedItem should delete restricted item', function() {
    scope.restrictedItemToDelete = { rowIndex: 0 };
    scope.formData.restrictedItems = [{ name: 'discount 1' }, { name: 'discount 2' }];

    scope.deleteRestrictedItem();

    expect(scope.formData.restrictedItems).toEqual([{ name: 'discount 2' }]);
  });

  it('addRestrictedItems should add restricted item', function() {
    scope.formData.restrictedItems = [{ name: 'discount 1' }, { name: 'discount 2' }];

    scope.addRestrictedItems();

    expect(scope.formData.restrictedItems.length).toEqual(3);
  });

  it('getGlobalDiscountDescriptionById should get global discount description by id', function() {
    scope.globalDiscountTypesList = [{ id: 1, description: 'description' }];

    expect(scope.getGlobalDiscountDescriptionById(1)).toEqual('description');
  });

  it('getRetailItemNameById should get retail item name by id', function() {
    scope.retailItemsList = [{ id: 1, itemName: 'name' }];

    expect(scope.getRetailItemNameById(1)).toEqual('name');
  });

  it('loadRestrictedItemsByCategory should load restricted items by category', function() {
    scope.loadRestrictedItemsByCategory(1);

    expect(itemsFactory.getItemsList).toHaveBeenCalledWith({ categoryId: 1 }, true);
  });

  it('updateItem should update item', function() {
    DiscountCreateCtrl.updateItem({ name: 'name' });

    expect(discountFactory.updateDiscount).toHaveBeenCalledWith(1, { name: 'name' });
  });

  it('createItem should update item', function() {
    DiscountCreateCtrl.createItem({ name: 'name' });

    expect(discountFactory.createDiscount).toHaveBeenCalledWith({ name: 'name' });
  });

});
