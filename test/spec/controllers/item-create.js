'use strict';

fdescribe('The Item Create Controller', function() {

  beforeEach(module('ts5App'));
  beforeEach(module('template-module'));
  beforeEach(module('served/item.json'));
  beforeEach(module('served/item-create.json'));
  beforeEach(module('served/items-list.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/sales-categories.json'));
  beforeEach(module('served/stations-date-filtered.json'));
  beforeEach(module('served/station-exception-currencies.json'));
  beforeEach(module('served/price-types.json'));
  beforeEach(module('served/tags.json'));
  beforeEach(module('served/tax-types.json'));
  beforeEach(module('served/currencies.json'));
  beforeEach(module('served/allergens.json'));
  beforeEach(module('served/item-types.json'));
  beforeEach(module('served/characteristics.json'));
  beforeEach(module('served/units-dimension.json'));
  beforeEach(module('served/units-volume.json'));
  beforeEach(module('served/units-weight.json'));
  beforeEach(module('served/price-types.json'));
  beforeEach(module('served/company-discounts.json'));

  var $rootScope;
  var scope;
  var $controller;
  var $location;
  var ItemCreateCtrl;
  var $httpBackend;
  var $routeParams;
  var dateUtility;
  var lodash;

  beforeEach(inject(function(_dateUtility_, _lodash_) {
    dateUtility = _dateUtility_;
    lodash = _lodash_;
  }));

  function createController($injector) {
    $location = $injector.get('$location');
    $location.path('/item-create');
    $rootScope = $injector.get('$rootScope');
    $routeParams = $injector.get('$routeParams');
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    ItemCreateCtrl = $controller('ItemCreateCtrl', {
      $scope: scope
    });
  }

  function renderView($templateCache, $compile) {
    var html = $templateCache.get('/views/item-create.html');
    var compiled = $compile(angular.element(html))(scope);
    var view = angular.element(compiled[0]);
    scope.$digest();
    return view;
  }

  describe('The ItemCreateCtrl', function() {

    beforeEach(inject(function($injector) {
      createController($injector);
    }));

    it('should be defined', function() {
      expect(ItemCreateCtrl).toBeDefined();
    });

    it('should have a the route /item-create', function() {
      expect($location.path()).toBe('/item-create');
    });

  });

  describe('The formData collection', function() {

    it('should be defined', function() {
      expect(scope.formData).toBeDefined();
    });

    it('should have a startDate property', function() {
      expect(scope.formData.startDate).toEqual(dateUtility.tomorrowFormatted());
    });

    it('should have an endDate property', function() {
      expect(scope.formData.endDate).toEqual(dateUtility.tomorrowFormatted());
    });

    it('should have an qrCodeValue property', function() {
      expect(scope.formData.qrCodeValue).toBeDefined();
    });

    it('should have a qrCodeImgUrl property', function() {
      expect(scope.formData.qrCodeImgUrl).toBeDefined();
    });

    it('should have an taxes property that is an empty array', function() {
      expect(scope.formData.taxes).toBeDefined();
      expect(scope.formData.taxes).toEqual([]);
    });

    it('should have an tags property that is an empty array', function() {
      expect(scope.formData.tags).toBeDefined();
      expect(scope.formData.tags).toEqual([]);
    });

    it('should have an allergens property that is an empty array', function() {
      expect(scope.formData.allergens).toBeDefined();
      expect(scope.formData.allergens).toEqual([]);
    });

    it('should have an characteristics property that is an empty array', function() {
      expect(scope.formData.characteristics).toBeDefined();
      expect(scope.formData.characteristics).toEqual([]);
    });

    it('should have an substitutions property that is an empty array', function() {
      expect(scope.formData.substitutions).toBeDefined();
      expect(scope.formData.substitutions).toEqual([]);
    });

    it('should have an recommendations property that is an empty array', function() {
      expect(scope.formData.recommendations).toBeDefined();
      expect(scope.formData.recommendations).toEqual([]);
    });

    it('should have an globalTradeNumbers property that is an empty array', function() {
      expect(scope.formData.globalTradeNumbers).toBeDefined();
      expect(scope.formData.globalTradeNumbers).toEqual([]);
    });

    it('should have a prices property that is an array with one price group object inside it', function() {
      expect(scope.formData.prices).toBeDefined();
      expect(scope.formData.prices.length).toBe(1);
    });

    it('should have a isMeasurementValid method', function() {
      expect(scope.isMeasurementValid).toBeDefined();
    });

    it('should have a isMeasurementRequired method', function() {
      expect(scope.isMeasurementRequired).toBeDefined();
    });

  });

  describe('init() method', function() {

    it('should be defined', function() {
      expect(ItemCreateCtrl.init).toBeDefined();
    });

    describe('init copy state', function() {
      beforeEach(function() {
        $location.path('/item-copy');
        $routeParams.id = 123;
        scope.cloningItem = false;
        scope.editingItem = false;
        scope.viewOnly = false;
      });

      it('should set cloningItem flag', function() {
        ItemCreateCtrl.init();
        expect(scope.cloningItem).toEqual(true);
        expect(scope.editingItem).toEqual(false);
        expect(scope.viewOnly).toEqual(false);
      });

      it('should set display name to Cloning', function() {
        ItemCreateCtrl.init();
        ItemCreateCtrl.updateViewName({
          itemName: 'TestItem'
        });
        expect(scope.viewName.indexOf('Cloning')).toBeGreaterThan(-1);
      });

      it('should set formData model', function() {
        expect(scope.formData).toBeDefined();
      });

      it('should not be set as active', function() {
        ItemCreateCtrl.init();
        ItemCreateCtrl.checkIfItemIsActive({
          startDate: '06/10/2010'
        });
        expect(scope.itemIsActive).toEqual(false);
      });

      it('should not be set as inactive', function() {
        ItemCreateCtrl.init();
        ItemCreateCtrl.checkIfItemIsInactive({
          endDate: '06/10/2010'
        });
        expect(scope.itemIsInactive).toEqual(false);
      });
    });

    describe('init edit state', function() {
      beforeEach(function() {
        $location.path('/item-edit');
        $routeParams.id = 123;
        scope.cloningItem = false;
        scope.editingItem = false;
        scope.viewOnly = false;
      });

      it('should set editingItem flag', function() {
        ItemCreateCtrl.init();
        expect(scope.cloningItem).toEqual(false);
        expect(scope.editingItem).toEqual(true);
        expect(scope.viewOnly).toEqual(false);
      });

      it('should set display name to Editing', function() {
        ItemCreateCtrl.init();
        ItemCreateCtrl.updateViewName({
          itemName: 'TestItem'
        });
        expect(scope.viewName.indexOf('Editing')).toBeGreaterThan(-1);
      });

      it('should set formData model', function() {
        expect(scope.formData).toBeDefined();
      });
    });

    describe('init view state', function() {
      beforeEach(function() {
        $location.path('/item-view');
        $routeParams.id = 123;
        scope.cloningItem = false;
        scope.editingItem = false;
        scope.viewOnly = false;
      });

      it('should set cloningItem flag', function() {
        ItemCreateCtrl.init();
        expect(scope.cloningItem).toEqual(false);
        expect(scope.editingItem).toEqual(false);
        expect(scope.viewOnly).toEqual(true);
      });

      it('should set display name to Editing', function() {
        ItemCreateCtrl.init();
        ItemCreateCtrl.updateViewName({
          itemName: 'TestItem'
        });
        expect(scope.viewName.indexOf('Viewing')).toBeGreaterThan(-1);
      });

      it('should set formData model', function() {
        expect(scope.formData).toBeDefined();
      });
    });

    describe('isMasterItemInfoDirty for clone page', function() {
      beforeEach(function() {
        scope.originalMasterItemData = {
          itemCode: 'testCode',
          itemName: 'testName',
          onBoardName: 'testName2'
        };
        scope.formData = angular.copy(scope.originalMasterItemData);
      });

      it('should be defined', function() {
        expect(ItemCreateCtrl.isMasterItemInfoDirty).toBeDefined();
      });

      it('should return false if formData is changed, but values are the same', function() {
        scope.formData.itemCode = 'testCode';
        scope.formData.itemName = 'testName';
        scope.formData.onBoardName = 'testName2';
        expect(ItemCreateCtrl.isMasterItemInfoDirty()).toEqual(false);
      });

      it('should return true if itemCode changes', function() {
        scope.formData.itemCode = 'newTestCode';
        expect(ItemCreateCtrl.isMasterItemInfoDirty()).toEqual(true);
      });

      it('should return true if itemName changes', function() {
        scope.formData.itemName = 'newTestName';
        expect(ItemCreateCtrl.isMasterItemInfoDirty()).toEqual(true);
      });

      it('should return true if itemCode changes', function() {
        scope.formData.onBoardName = 'newTestName2';
        expect(ItemCreateCtrl.isMasterItemInfoDirty()).toEqual(true);
      });

    });

    describe('getDependencies() method', function() {
      var responseArray;
      var companiesFactory;
      var currencyFactory;
      var itemsFactory;
      var salesCategoriesDeferred;
      var tagsListDeferred;
      var taxTypeDeferred;
      var masterCurrenciesListDeferred;
      var allergenListDeferred;
      var itemTypesDeferred;
      var characteristicsDeferred;
      var dimensionListDeferred;
      var volumeListDeferred;
      var weightListDeferred;
      var priceTypeListDeferred;
      var itemsListDeferred;
      var getDiscountListDeferred;

      beforeEach(inject(function($injector, $q, $rootScope, _servedSalesCategories_, _servedTags_,
        _servedTaxTypes_,
        _servedCurrencies_, _servedAllergens_, _servedItemTypes_, _servedCharacteristics_,
        _servedUnitsDimension_, _servedUnitsVolume_, _servedUnitsWeight_, _servedPriceTypes_,
        _servedItemsList_, _servedCompanyDiscounts_) {
        responseArray = [
          _servedSalesCategories_,
          _servedTags_,
          _servedTaxTypes_,
          _servedCurrencies_,
          _servedAllergens_,
          _servedItemTypes_,
          _servedCharacteristics_,
          _servedUnitsDimension_,
          _servedUnitsVolume_,
          _servedUnitsWeight_,
          _servedPriceTypes_,
          _servedItemsList_,
          _servedCompanyDiscounts_
        ];

        companiesFactory = $injector.get('companiesFactory');
        currencyFactory = $injector.get('currencyFactory');
        itemsFactory = $injector.get('itemsFactory');

        salesCategoriesDeferred = $q.defer();
        tagsListDeferred = $q.defer();
        taxTypeDeferred = $q.defer();
        masterCurrenciesListDeferred = $q.defer();
        allergenListDeferred = $q.defer();
        itemTypesDeferred = $q.defer();
        characteristicsDeferred = $q.defer();
        dimensionListDeferred = $q.defer();
        volumeListDeferred = $q.defer();
        weightListDeferred = $q.defer();
        priceTypeListDeferred = $q.defer();
        itemsListDeferred = $q.defer();
        getDiscountListDeferred = $q.defer();
        getDiscountListDeferred.resolve(responseArray[12]);

        spyOn(ItemCreateCtrl, 'setSalesCategories').and.callThrough();
        spyOn(companiesFactory, 'getSalesCategoriesList').and.returnValue(responseArray[0]);
        spyOn(companiesFactory, 'getTagsList').and.returnValue(responseArray[1]);
        spyOn(companiesFactory, 'getTaxTypesList').and.returnValue(responseArray[2]);
        spyOn(currencyFactory, 'getCompanyCurrencies').and.returnValue(responseArray[3]);
        spyOn(itemsFactory, 'getAllergensList').and.returnValue(responseArray[4]);
        spyOn(itemsFactory, 'getItemTypesList').and.returnValue(responseArray[5]);
        spyOn(itemsFactory, 'getCharacteristicsList').and.returnValue(responseArray[6]);
        spyOn(itemsFactory, 'getDimensionList').and.returnValue(responseArray[7]);
        spyOn(itemsFactory, 'getVolumeList').and.returnValue(responseArray[8]);
        spyOn(itemsFactory, 'getWeightList').and.returnValue(responseArray[9]);
        spyOn(itemsFactory, 'getPriceTypesList').and.returnValue(responseArray[10]);
        spyOn(itemsFactory, 'getItemsList').and.returnValue(responseArray[11]);
        spyOn(itemsFactory, 'getDiscountList').and.returnValue(getDiscountListDeferred.promise);
        createController($injector);
      }));

      describe('setSalesCategories method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setSalesCategories').and.callThrough();
        });

        it('should expect scope.salesCategories to be undefined', function() {
          expect(scope.salesCategories).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          salesCategoriesDeferred.resolve();
          expect(ItemCreateCtrl.setSalesCategories).toHaveBeenCalled();
        });

        it('should set the scope.salesCategories after the promise is resolved', function() {
          scope.$digest();
          salesCategoriesDeferred.resolve();
          expect(scope.salesCategories).toBeDefined();
        });

      });

      describe('getDiscountList from API', function() {
        it('should call the API with start and end date', function() {
          scope.formData.startDate = '08/29/2015';
          scope.formData.endDate = '08/29/2019';
          scope.$digest();
          expect(itemsFactory.getDiscountList).toHaveBeenCalledWith({
            discountTypeId: 4,
            startDate: '20150829',
            endDate: '20190829'
          });
        });

        it('should not call the API when start or end date are null', function() {
          scope.formData.startDate = '08/29/2015';
          delete scope.formData.endDate;
          scope.$digest();
          expect(itemsFactory.getDiscountList).not.toHaveBeenCalled();
        });

      });

      describe('setTagsList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setTagsList').and.callThrough();
        });

        it('should expect scope.tags to be undefined', function() {
          expect(scope.tags).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          tagsListDeferred.resolve();
          expect(ItemCreateCtrl.setTagsList).toHaveBeenCalled();
        });

        it('should set the scope.tags after the promise is resolved', function() {
          scope.$digest();
          tagsListDeferred.resolve();
          expect(scope.tags).toBeDefined();
        });

      });

      describe('setTaxTypesList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setTaxTypesList').and.callThrough();
        });

        it('should expect scope.taxTypes to be undefined', function() {
          expect(scope.taxTypes).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          taxTypeDeferred.resolve();
          expect(ItemCreateCtrl.setTaxTypesList).toHaveBeenCalled();
        });

        it('should set the scope.taxTypes after the promise is resolved', function() {
          scope.$digest();
          taxTypeDeferred.resolve();
          expect(scope.taxTypes).toBeDefined();
        });

      });

      describe('setMasterCurrenciesList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setMasterCurrenciesList').and.callThrough();
        });

        it('should expect scope.masterCurrenciesList to be undefined', function() {
          expect(scope.masterCurrenciesList).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          masterCurrenciesListDeferred.resolve();
          expect(ItemCreateCtrl.setMasterCurrenciesList).toHaveBeenCalled();
        });

        it('should set the scope.masterCurrenciesList after the promise is resolved', function() {
          scope.$digest();
          masterCurrenciesListDeferred.resolve();
          expect(scope.masterCurrenciesList).toBeDefined();
        });

      });

      describe('setAllergens method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setAllergens').and.callThrough();
        });

        it('should expect scope.allergens to be undefined', function() {
          expect(scope.allergens).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          allergenListDeferred.resolve();
          expect(ItemCreateCtrl.setAllergens).toHaveBeenCalled();
        });

        it('should set the scope.allergens after the promise is resolved', function() {
          scope.$digest();
          allergenListDeferred.resolve();
          expect(scope.allergens).toBeDefined();
        });

      });

      describe('setItemTypes method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setItemTypes').and.callThrough();
        });

        it('should expect scope.itemTypes to be undefined', function() {
          expect(scope.itemTypes).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          itemTypesDeferred.resolve();
          expect(ItemCreateCtrl.setItemTypes).toHaveBeenCalled();
        });

        it('should set the scope.itemTypes after the promise is resolved', function() {
          scope.$digest();
          itemTypesDeferred.resolve();
          expect(scope.itemTypes).toBeDefined();
        });

      });

      describe('setCharacteristics method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setCharacteristics').and.callThrough();
        });

        it('should expect scope.characteristics to be undefined', function() {
          expect(scope.characteristics).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          characteristicsDeferred.resolve();
          expect(ItemCreateCtrl.setCharacteristics).toHaveBeenCalled();
        });

        it('should set the scope.characteristics after the promise is resolved', function() {
          scope.$digest();
          characteristicsDeferred.resolve();
          expect(scope.characteristics).toBeDefined();
        });

      });

      describe('setDimensionList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setDimensionList').and.callThrough();
        });

        it('should expect scope.dimensionUnits to be undefined', function() {
          expect(scope.dimensionUnits).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          dimensionListDeferred.resolve();
          expect(ItemCreateCtrl.setDimensionList).toHaveBeenCalled();
        });

        it('should set the scope.dimensionUnits after the promise is resolved', function() {
          scope.$digest();
          dimensionListDeferred.resolve();
          expect(scope.dimensionUnits).toBeDefined();
        });

      });

      describe('setVolumeList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setVolumeList').and.callThrough();
        });

        it('should expect scope.volumeUnits to be undefined', function() {
          expect(scope.volumeUnits).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          volumeListDeferred.resolve();
          expect(ItemCreateCtrl.setVolumeList).toHaveBeenCalled();
        });

        it('should set the scope.dimensionUnits after the promise is resolved', function() {
          scope.$digest();
          volumeListDeferred.resolve();
          expect(scope.volumeUnits).toBeDefined();
        });

      });

      describe('setWeightList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setWeightList').and.callThrough();
        });

        it('should expect scope.weightUnits to be undefined', function() {
          expect(scope.weightUnits).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          weightListDeferred.resolve();
          expect(ItemCreateCtrl.setWeightList).toHaveBeenCalled();
        });

        it('should set the scope.weightUnits after the promise is resolved', function() {
          scope.$digest();
          weightListDeferred.resolve();
          expect(scope.weightUnits).toBeDefined();
        });

      });

      describe('setItemPriceTypes method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setItemPriceTypes').and.callThrough();
        });

        it('should expect scope.priceTypes to be undefined', function() {
          expect(scope.priceTypes).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          priceTypeListDeferred.resolve();
          expect(ItemCreateCtrl.setItemPriceTypes).toHaveBeenCalled();
        });

        it('should set the scope.priceTypes after the promise is resolved', function() {
          scope.$digest();
          priceTypeListDeferred.resolve();
          expect(scope.priceTypes).toBeDefined();
        });

      });

      describe('setItemList method', function() {

        var idOfItemInEditMode = 403;

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setItemList').and.callThrough();
        });

        afterEach(function() {
          delete $routeParams.id;
        });

        it('should expect scope.items to be undefined', function() {
          expect(scope.items).toBeUndefined();
        });

        it('should expect scope.substitutions to be undefined', function() {
          expect(scope.substitutions).toBeUndefined();
        });

        it('should expect scope.recommendations to be undefined', function() {
          expect(scope.recommendations).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          itemsListDeferred.resolve();
          expect(ItemCreateCtrl.setItemList).toHaveBeenCalled();
        });

        it('should set the scope.items after the promise is resolved', function() {
          scope.$digest();
          itemsListDeferred.resolve();
          expect(scope.items).toBeDefined();
        });

        it('should set the scope.substitutions after the promise is resolved', function() {
          scope.$digest();
          itemsListDeferred.resolve();
          expect(scope.substitutions).toBeDefined();
        });

        it('should not delete any item from scope.substitutions if not in edit mode', function() {
          scope.$digest();
          var substitutionsLength = scope.substitutions.length;
          itemsListDeferred.resolve();
          expect(scope.substitutions.length).toBe(substitutionsLength);
          var itemIdFromList = parseInt(scope.substitutions[0].id);
          expect(itemIdFromList).toEqual(idOfItemInEditMode);
        });

        it('should remove the item from scope.substitutions with id === 332 from the list', function() {
          $routeParams.id = idOfItemInEditMode;
          scope.$digest();
          itemsListDeferred.resolve();
          var currentItemMatch = lodash.findWhere(scope.substitutions, { id: idOfItemInEditMode });
          expect(currentItemMatch).not.toBeDefined();
        });

        it('should set the scope.recommendations after the promise is resolved', function() {
          scope.$digest();
          itemsListDeferred.resolve();
          expect(scope.recommendations).toBeDefined();
        });

        describe('formatPayload method', function() {

          beforeEach(function() {
            spyOn(ItemCreateCtrl, 'formatPayload');
            ItemCreateCtrl.formatPayload();
            scope.$digest();
          });

          it('should be defined', function() {
            expect(ItemCreateCtrl.formatPayload).toBeDefined();
          });

          it('should have be called', function() {
            expect(ItemCreateCtrl.formatPayload).toHaveBeenCalled();
          });

          describe('formatVoucherData', function() {

            it(
              'should set isDynamicBarcodes when isVoucherSelected and remove unused shouldUseDynamicBarcode property',
              function() {
                scope.isVoucherSelected = true;
                var itemData = {
                  shouldUseDynamicBarcode: {
                    value: true
                  }
                };
                ItemCreateCtrl.formatVoucherData(itemData);
                expect(itemData.isDynamicBarcodes).toBe(true);
                expect(itemData.shouldUseDynamicBarcode).toBeUndefined();

              });

            it('should set companyDiscountId from voucherId and remove unused voucher property',
              function() {
                scope.isVoucherSelected = true;
                var itemData = {
                  voucher: {
                    id: 1979
                  }
                };
                ItemCreateCtrl.formatVoucherData(itemData);
                expect(itemData.companyDiscountId).toBe(1979);
                expect(itemData.voucher).toBeUndefined();

              });
          });

        });

      });

      describe('set voucher data on scope', function() {

        it('should set the value for use dynamic barcode select box', function() {
          var itemData = {
            isDynamicBarcodes: false
          };
          ItemCreateCtrl.setVoucherData(itemData);
          expect(scope.formData.shouldUseDynamicBarcode.value).toBe(itemData.isDynamicBarcodes);
        });

        it('should attach the voucher object to the scope', function() {
          scope.formData.companyDiscountId = 1979;
          scope.discountList = [{
            id: 100
          }, {
            id: 1979
          }];
          ItemCreateCtrl.setVoucherData();
          expect(scope.formData.voucher.id).toBe(scope.formData.companyDiscountId);
        });

      });

      describe('setUIReady() method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setUIReady').and.callThrough();
        });

        it('should expect the UI ready flag to be false', function() {
          expect(scope.uiSelectTemplateReady).toBeFalsy();
        });

        it('should expect to have been called', function() {
          scope.$digest();
          expect(ItemCreateCtrl.setUIReady).toHaveBeenCalled();
        });

        it('should expect the UI ready flag to be true after promises are resovled', function() {
          scope.$digest();
          expect(scope.uiSelectTemplateReady).toBeTruthy();
        });

      });

      describe('the determine minimum date functionality', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'determineMinDate').and.callThrough();
          scope.$digest();
        });

        it('should determine the min date on success', function() {
          expect(ItemCreateCtrl.determineMinDate).toHaveBeenCalled();
        });

        it('should set the minDate in the scope', function() {
          expect(scope.minDate).toEqual(ItemCreateCtrl.determineMinDate());
        });

        it('should return a formatted string', function() {
          var dateStringControl = '+1d';
          var dateStringTest = ItemCreateCtrl.determineMinDate();
          expect(dateStringTest).toEqual(dateStringControl);
        });

      });

    });

  });

  describe('submitting the form', function() {
    var formData;
    var view;
    var form;
    beforeEach(inject(function(_$templateCache_, _$compile_, _servedItemCreate_) {
      formData = angular.copy(_servedItemCreate_);
      view = renderView(_$templateCache_, _$compile_);
      form = angular.element(view.find('form')[0]);
      $httpBackend.expectPOST(/\/api\/retail-items/).respond(200, '');
    }));

    function mockFormSubmission(formData) {
      scope.submitForm(formData);
      scope.$digest();
    }

    it('should have a submitForm() method attached to the scope', function() {
      expect(scope.submitForm).toBeDefined();
    });

    it('should set the form submitted flag when called', function() {
      expect(scope.form.$submitted).toBeFalsy();
      mockFormSubmission(formData);
      expect(scope.form.$submitted).toBeTruthy();
    });

    describe('validating the form', function() {

      beforeEach(function() {
        spyOn(ItemCreateCtrl, 'validateForm').and.callThrough();
      });

      it('should have a method attached to the controller', function() {
        expect(ItemCreateCtrl.validateForm).toBeDefined();
      });

      it('should be called during the submission', function() {
        mockFormSubmission(formData);
        expect(ItemCreateCtrl.validateForm).toHaveBeenCalled();
      });

      describe('GTINClass method', function() {
        it('should be defined', function() {
          expect(scope.GTINClass).toBeDefined();
        });

        it('should have been called', function() {
          spyOn(scope, 'GTINClass');
          scope.GTINClass(form, 0);
          expect(scope.GTINClass).toHaveBeenCalled();
        });
      });

      describe('Create Item method', function() {
        var itemsFactory;
        beforeEach(inject(function($injector) {
          itemsFactory = $injector.get('itemsFactory');
          spyOn(ItemCreateCtrl, 'createItem').and.callThrough();
          spyOn(itemsFactory, 'createItem').and.returnValue({
            then: function(callback) {
              return callback();
            }
          });
        }));

        it('should be defined', function() {
          expect(ItemCreateCtrl.createItem).toBeDefined();
        });

        it('should return true if item was created', function() {
          expect(itemsFactory.createItem).toBeTruthy();
        });

      });

    });

  });

  describe('view', function() {

    var view;

    beforeEach(inject(function(_$templateCache_, _$compile_) {
      view = renderView(_$templateCache_, _$compile_);
    }));

    it('should be defined', function() {
      expect(view).toBeDefined();
    });

    it('should have a form', function() {
      expect(view.find(' form').length).toEqual(1);
    });

    describe('UI for price and tax', function() {

      describe('tax type button', function() {

        var taxTypeBtn;

        beforeEach(function() {
          taxTypeBtn = view.find('#add-tax-type');
        });
      });
    });
  });

  /*
   * Price Groups
   */
  describe('Price Groups', function() {

    beforeEach(inject(function($injector) {
      createController($injector);
      $httpBackend.whenGET(/./).respond(200, '');
    }));

    it('should have one price group added to the scope when the controller inits', function() {
      var priceGroup = scope.formData.prices[0];
      expect(priceGroup).toBeDefined();
    });

    describe('addPriceGroup()', function() {

      it('should be able to add a price group to the prices array', function() {
        scope.addPriceGroup();
        expect(scope.formData.prices.length).toBe(2);
      });

      it('should create the correct price group data set', function() {
        scope.addPriceGroup();
        var priceGroup = scope.formData.prices[1];
        expect(priceGroup.startDate).toBeDefined();
        expect(priceGroup.endDate).toBeDefined();
        expect(priceGroup.priceCurrencies).toBeDefined();
        expect(priceGroup.priceCurrencies).toEqual([]);
        expect(priceGroup.stationExceptions).toBeDefined();
        expect(priceGroup.stationExceptions).toEqual([]);
      });

    });

    describe('removePriceGroup()', function() {

      it('should remove a price group from the prices array', function() {
        scope.removePriceGroup(0);
        expect(scope.formData.prices.length).toBe(0);
      });

    });

    describe('watchPriceGroups()', function() {

      var currenciesListJSON;
      var getCurrenciesListDeferred;
      var currencyFactory;
      var priceGroup;

      function mockDateChange() {
        scope.$digest();
        var priceGroup = scope.formData.prices[0];
        priceGroup.startDate = dateUtility.nowFormatted();
        priceGroup.endDate = dateUtility.nowFormatted();
        scope.$digest();
      }

      beforeEach(inject(function($q, $injector, _servedCurrencies_) {
        priceGroup = scope.formData.prices[0];
        currenciesListJSON = _servedCurrencies_;
        currencyFactory = $injector.get('currencyFactory');
        getCurrenciesListDeferred = $q.defer();
        getCurrenciesListDeferred.resolve(currenciesListJSON);
        spyOn(ItemCreateCtrl, 'watchPriceGroups').and.callThrough();
        spyOn(ItemCreateCtrl, 'checkPriceGroup').and.callThrough();
        spyOn(ItemCreateCtrl, 'updatePriceGroup').and.callThrough();
        spyOn(currencyFactory, 'getCompanyCurrencies').and.returnValue(getCurrenciesListDeferred.promise);
        spyOn(ItemCreateCtrl, 'getPriceCurrenciesList').and.callThrough();
        spyOn(ItemCreateCtrl, 'generatePriceCurrenciesList').and.callThrough();
        spyOn(ItemCreateCtrl, 'setPriceCurrenciesList').and.callThrough();
      }));

      it('should be called when the data in the price group changes', function() {
        mockDateChange();
        expect(ItemCreateCtrl.watchPriceGroups).toHaveBeenCalled();
      });

      it('should call checkPriceGroup() ', function() {
        mockDateChange();
        expect(ItemCreateCtrl.checkPriceGroup).toHaveBeenCalled();
      });

      it('should be called when the data in the price group changes', function() {
        mockDateChange();
        expect(ItemCreateCtrl.updatePriceGroup).toHaveBeenCalled();
      });

      it('should have no currencies associated to the price before the API call', function() {
        expect(priceGroup.priceCurrencies).toEqual([]);
      });

      describe('getPriceCurrenciesList()', function() {

        var priceIndex;
        beforeEach(function() {
          priceIndex = 0;
          priceGroup = scope.formData.prices[priceIndex];
        });

        it('should be called', function() {
          mockDateChange();
          expect(ItemCreateCtrl.getPriceCurrenciesList).toHaveBeenCalled();
        });

        it('should call generatePriceCurrenciesList', function() {
          mockDateChange();
          expect(ItemCreateCtrl.generatePriceCurrenciesList).toHaveBeenCalled();
        });

        it('should generate a list of currencies for the price group', function() {
          mockDateChange();
          var controlPriceList = ItemCreateCtrl.generatePriceCurrenciesList(priceIndex,
            currenciesListJSON.response);
          expect(priceGroup.priceCurrencies).toEqual(controlPriceList);
        });

        it('should have called the setPriceCurrenciesList method', function() {
          mockDateChange();
          expect(ItemCreateCtrl.setPriceCurrenciesList).toHaveBeenCalled();
        });

      });

    });

  });

  /*
   * Station Exceptions
   */

  describe('Station Exceptions |', function() {

    var stationsJSON;
    var stationException;

    beforeEach(inject(function($injector) {
      createController($injector);
      scope.addStationException(0);

    }));

    it('should be have a addStationException method', function() {
      expect(scope.addStationException).toBeDefined();
    });

    it('should be able to add a stationException to the price group', function() {

      expect(scope.formData.prices[0].stationExceptions.length).toBe(1);

      stationException = scope.formData.prices[0].stationExceptions[0];

      expect(stationException.startDate).toBeDefined();

      expect(stationException.endDate).toBeDefined();

      expect(stationException.stationExceptionCurrencies).toBeDefined();

      expect(stationException.stationExceptionCurrencies).toEqual([]);

    });

    it('should be have a removeStationException method', function() {
      expect(scope.removeStationException).toBeDefined();
    });

    it('should be able to remove a stationException from the price group', function() {

      expect(scope.formData.prices[0].stationExceptions.length).toBe(1);

      scope.removeStationException(0);

      expect(scope.formData.prices[0].stationExceptions.length).toBe(0);

    });

    it('should be have a getGlobalStationList method', function() {
      expect(ItemCreateCtrl.getGlobalStationList).toBeDefined();
    });

    describe('The ItemCreateCtrl.getGlobalStationList method', function() {

      var response;
      var testObject;

      beforeEach(inject(function() {

        inject(function(_servedStationsDateFiltered_) {
          stationsJSON = _servedStationsDateFiltered_;
        });

        // spy on the query of the items service
        spyOn(ItemCreateCtrl, 'getGlobalStationList').and.callFake(function() {
          return stationsJSON;
        });

        // make the mock query call
        response = ItemCreateCtrl.getGlobalStationList();

        // grab first item in list
        testObject = response.response[0];

      }));

      it('should have been called', function() {
        expect(ItemCreateCtrl.getGlobalStationList).toHaveBeenCalled();
      });

      it('should return a response from the API', function() {
        expect(response).toBeDefined();
      });

      it('should return a response from the API containg a response array', function() {
        expect(response.response).toBeDefined();
      });

      it('should return an array of stations containing at least station', function() {
        expect(response.response.length).toBeGreaterThan(0);
      });

      it('should contain a station object with a station code', function() {
        expect(testObject.code).toBeDefined();
        expect(testObject.code).toEqual(jasmine.any(String));
        expect(testObject.code.length).toEqual(3);
      });

      it('should contain a station object with a station id', function() {
        expect(testObject.id).toBeDefined();
        expect(testObject.id).toEqual(jasmine.any(Number));
      });

      it('should contain a station object with a company id', function() {
        expect(testObject.companyId).toBeDefined();
        expect(testObject.companyId).toEqual(jasmine.any(Number));
      });

    });

    it('should be have a setStationsList method', function() {
      expect(ItemCreateCtrl.setStationsList).toBeDefined();
    });

    describe('The ItemCreateCtrl.setStationsList method', function() {

      var station;

      beforeEach(inject(function() {

        scope.addStationException(0);

        inject(function(_servedStationsDateFiltered_) {
          stationsJSON = _servedStationsDateFiltered_;
        });

        spyOn(ItemCreateCtrl, 'setStationsList').and.callThrough();

        stationException = scope.formData.prices[0].stationExceptions[0];

        ItemCreateCtrl.setStationsList(stationException, stationsJSON);

        station = stationException.stations[0];

      }));

      it('should have been called', function() {
        expect(ItemCreateCtrl.setStationsList).toHaveBeenCalled();
      });

      it('should have a stations collection', function() {
        expect(stationException.stations).toBeDefined();
        expect(stationException.stations.length).toBeGreaterThan(0);
      });

      it('should contain a station object with a station code', function() {
        expect(station.code).toBeDefined();
        expect(station.code).toEqual(jasmine.any(String));
        expect(station.code.length).toEqual(3);
      });

      it('should contain a station object with a station id', function() {
        expect(station.id).toBeDefined();
        expect(station.id).toEqual(jasmine.any(Number));
      });

      it('should contain a station object with a company id', function() {
        expect(station.companyId).toBeDefined();
        expect(station.companyId).toEqual(jasmine.any(Number));
      });

    });

    it('should be have a getStationsCurrenciesList method', function() {
      expect(ItemCreateCtrl.getStationsCurrenciesList).toBeDefined();
    });

    describe('The ItemCreateCtrl.getStationsCurrenciesList method', function() {

      var stationExceptionCurrenciesJSON;
      var response;
      var testObject;

      beforeEach(inject(function() {

        inject(function(_servedStationExceptionCurrencies_) {
          stationExceptionCurrenciesJSON = _servedStationExceptionCurrencies_;
        });

        // spy on the query of the items service
        spyOn(ItemCreateCtrl, 'getStationsCurrenciesList').and.callFake(function() {
          return stationExceptionCurrenciesJSON;
        });

        // make the mock query call
        response = ItemCreateCtrl.getStationsCurrenciesList();

        // grab first item in list
        testObject = response.response[0];

      }));

      it('should have been called', function() {
        expect(ItemCreateCtrl.getStationsCurrenciesList).toHaveBeenCalled();
      });

      it('should return a response from the API', function() {
        expect(response).toBeDefined();
      });

      it('should return a response from the API containg a response array', function() {
        expect(response.response).toBeDefined();
      });

      it('should return an array of stations currencies containing at least station currency', function() {
        expect(response.response.length).toBeGreaterThan(0);
      });

      it('should contain a station currency object with a station code', function() {
        expect(testObject.code).toBeDefined();
        expect(testObject.code).toEqual(jasmine.any(String));
        expect(testObject.code.length).toEqual(3);
      });

      it('should contain a station currency object with a station id', function() {
        expect(testObject.id).toBeDefined();
        expect(testObject.id).toEqual(jasmine.any(Number));
      });

      it('should contain a station currency object with a company id', function() {
        expect(testObject.companyId).toBeDefined();
        expect(testObject.companyId).toEqual(jasmine.any(Number));
      });

    });

    it('should be have a setStationsCurrenciesList method', function() {
      expect(ItemCreateCtrl.setStationsCurrenciesList).toBeDefined();
    });

    describe('The ItemCreateCtrl.setStationsCurrenciesList method', function() {

      var stationExceptionCurrenciesJSON;

      beforeEach(inject(function() {

        scope.addStationException(0);

        inject(function(_servedStationExceptionCurrencies_) {
          stationExceptionCurrenciesJSON = _servedStationExceptionCurrencies_;
        });

        spyOn(ItemCreateCtrl, 'setStationsCurrenciesList').and.callThrough();

        stationException = scope.formData.prices[0].stationExceptions[0];

        ItemCreateCtrl.setStationsCurrenciesList(stationException, stationExceptionCurrenciesJSON);

      }));

      it('should have been called', function() {
        expect(ItemCreateCtrl.setStationsCurrenciesList).toHaveBeenCalled();
      });

      it('should have a stationExceptionCurrencies collection', function() {
        expect(stationException.stationExceptionCurrencies).toBeDefined();
        expect(stationException.stationExceptionCurrencies.length).toBeGreaterThan(0);
      });

    });

    it('should be have a generateStationCurrenciesList method', function() {
      expect(ItemCreateCtrl.generateStationCurrenciesList).toBeDefined();
    });

    describe('The ItemCreateCtrl.generateStationCurrenciesList method', function() {

      var stationExceptionCurrency;
      var stationExceptionCurrenciesJSON;
      var stationExceptionCurrenciesList;

      beforeEach(inject(function() {

        scope.addStationException(0);

        inject(function(_servedStationExceptionCurrencies_) {
          stationExceptionCurrenciesJSON = _servedStationExceptionCurrencies_;
        });

        spyOn(ItemCreateCtrl, 'generateStationCurrenciesList').and.callThrough();

        stationException = scope.formData.prices[0].stationExceptions[0];

        stationExceptionCurrenciesList = ItemCreateCtrl.generateStationCurrenciesList(
          stationExceptionCurrenciesJSON);

        stationExceptionCurrency = stationExceptionCurrenciesList[0];

      }));

      it('should have been called', function() {
        expect(ItemCreateCtrl.generateStationCurrenciesList).toHaveBeenCalled();
      });

      it('should generate a stationExceptionCurrencies collection', function() {
        expect(stationExceptionCurrenciesList).toBeDefined();
        expect(stationExceptionCurrenciesList.length).toBeGreaterThan(0);
      });

      it('should contain a stationExceptionCurrency object with a currency code', function() {
        expect(stationExceptionCurrency.price).toBeDefined();
        expect(stationExceptionCurrency.price).toEqual(null);
      });

      it('should contain a stationExceptionCurrency object with a companyCurrencyId', function() {
        expect(stationExceptionCurrency.companyCurrencyId).toBeDefined();
        expect(stationExceptionCurrency.companyCurrencyId).toEqual(jasmine.any(Number));
      });

    });

    it('should be have a updateStationException method', function() {
      expect(ItemCreateCtrl.updateStationException).toBeDefined();
    });

    describe('The ItemCreateCtrl.updateStationException method', function() {

      beforeEach(inject(function() {

        scope.addStationException(0);

        spyOn(ItemCreateCtrl, 'getGlobalStationList').and.callThrough();

        spyOn(ItemCreateCtrl, 'getStationsCurrenciesList').and.callThrough();

        spyOn(ItemCreateCtrl, 'updateStationException').and.callThrough();

        stationException = scope.formData.prices[0].stationExceptions[0];

        ItemCreateCtrl.updateStationException(0, 0);

      }));

      it('should have been called', function() {
        expect(ItemCreateCtrl.updateStationException).toHaveBeenCalled();
      });

      it('should have called getGlobalStationList', function() {
        expect(ItemCreateCtrl.getGlobalStationList).toHaveBeenCalled();
      });

      it('should have called getStationsCurrenciesList', function() {
        expect(ItemCreateCtrl.getStationsCurrenciesList).toHaveBeenCalled();
      });

    });

    it('should be have a updateStationsList method', function() {
      expect(ItemCreateCtrl.updateStationsList).toBeDefined();
    });

    it('should be have a handleStationPromises method', function() {
      expect(ItemCreateCtrl.handleStationPromises).toBeDefined();
    });

  });

  describe('scope.uiSelectTemplateReady variable', function() {

    it('should be defined', function() {
      expect(scope.uiSelectTemplateReady).toBeDefined();
    });

    it('should return false', function() {
      expect(scope.uiSelectTemplateReady).toBeFalsy();
    });

  });

  describe('the error handler', function() {

    var mockError;

    beforeEach(function() {
      mockError = {
        status: 400,
        statusText: 'Bad Request',
        response: {
          field: 'bogan',
          code: '000'
        }
      };
      ItemCreateCtrl.errorHandler(mockError);
    });

    it('should set error data ', function() {
      expect(scope.errorResponse).toEqual(mockError);
    });

    it('should return false', function() {
      expect(scope.displayError).toBeTruthy();
    });

  });

  describe('setSelected', function() {
    beforeEach(inject(function($injector) {
      createController($injector);
    }));

    it('should return false if model and id do not match', function() {
      expect(scope.setSelected(3, 1)).toBeFalsy();
    });

    it('should return true if model and id match', function() {
      expect(scope.setSelected(3, 3)).toBeTruthy();
    });

    it('should return true if model and id match, even if one is not an int', function() {
      expect(scope.setSelected(3, '3')).toBeTruthy();
    });

  });

  describe('scope.substitutions variable', function() {
    it('should be able to remove non active records between start and end date', function() {
      scope.items = [{
        startDate: '04/10/1980',
        endDate: '02/20/2050'
      }, {
        startDate: '04/15/1980',
        endDate: '05/20/1999'
      }];
      scope.formData.startDate = '04/15/2000';
      scope.formData.endDate = '05/20/2030';
      ItemCreateCtrl.filterItemsByFormDates(scope.item);
      scope.$digest();
      expect(scope.substitutions.length).toEqual(1);
      expect(scope.substitutions[0].startDate).toEqual('04/10/1980');
    });

    it('should be able to remove duplicate records', function () {

    });
  });

});
