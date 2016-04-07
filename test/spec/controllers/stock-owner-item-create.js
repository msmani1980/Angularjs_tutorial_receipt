'use strict';

describe('The Stock Owner Item Create Controller', function() {

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
  beforeEach(module('served/company.json'));

  var $rootScope;
  var scope;
  var $controller;
  var $location;
  var StockOwnerItemCreateCtrl;
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
    $location.path('/stock-owner-item-create');
    $rootScope = $injector.get('$rootScope');
    $routeParams = $injector.get('$routeParams');
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    StockOwnerItemCreateCtrl = $controller('StockOwnerItemCreateCtrl', {
      $rootScope: $rootScope,
      $scope: scope
    });
  }

  function renderView($templateCache, $compile) {
    var html = $templateCache.get('/views/stock-owner-item-create.html');
    var compiled = $compile(angular.element(html))(scope);
    var view = angular.element(compiled[0]);
    scope.$digest();
    return view;
  }

  describe('The StockOwnerItemCreateCtrl', function() {
    beforeEach(inject(function($injector) {
      createController($injector);
    }));

    it('should be defined', function() {
      expect(StockOwnerItemCreateCtrl).toBeDefined();
    });

    it('should have a the route /stock-owner-item-create', function() {
      expect($location.path()).toBe('/stock-owner-item-create');
    });

  });

  describe('formData collection', function() {

    it('should be defined', function() {
      expect(scope.formData).toBeDefined();
    });

    it('should have a startDate property', function() {
      expect(scope.formData.startDate).toBeDefined();
    });

    it('should have an endDate property', function() {
      expect(scope.formData.endDate).toBeDefined();
    });

    it('should have an qrCodeValue property', function() {
      expect(scope.formData.qrCodeValue).toBeDefined();
    });

    it('should have a qrCodeImgUrl property', function() {
      expect(scope.formData.qrCodeImgUrl).toBeDefined();
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

    it('should have a costPrices property that is an array with one price group object inside it', function() {
      expect(scope.formData.costPrices).toBeDefined();
      expect(scope.formData.costPrices.length).toBe(1);
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
      expect(StockOwnerItemCreateCtrl.init).toBeDefined();
    });

    describe('getDependencies() method', function() {
      var responseArray, companiesFactory, currencyFactory, itemsFactory, salesCategoriesDeferred,
        tagsListDeferred, taxTypeDeferred, masterCurrenciesListDeferred, allergenListDeferred,
        itemTypesDeferred, characteristicsDeferred, dimensionListDeferred, volumeListDeferred,
        weightListDeferred, companyDeferred, itemsListDeferred, characteristics;

      beforeEach(inject(function($injector, $q, $rootScope, _servedSalesCategories_, _servedTags_,
        _servedTaxTypes_,
        _servedCurrencies_, _servedAllergens_, _servedItemTypes_, _servedCharacteristics_,
        _servedUnitsDimension_, _servedUnitsVolume_, _servedUnitsWeight_, _servedCompany_,
        _servedItemsList_) {
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
          _servedItemsList_,
          _servedCompany_
        ];

        characteristics = _servedCharacteristics_;

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
        itemsListDeferred = $q.defer();
        companyDeferred = $q.defer();

        spyOn(StockOwnerItemCreateCtrl, 'setSalesCategories').and.callThrough();
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
        spyOn(itemsFactory, 'getItemsList').and.returnValue(responseArray[10]);
        spyOn(companiesFactory, 'getCompany').and.returnValue(responseArray[11]);
        createController($injector);
      }));

      describe('setSalesCategories method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setSalesCategories').and.callThrough();
        });

        it('should expect scope.salesCategories to be undefined', function() {
          expect(scope.salesCategories).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          salesCategoriesDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setSalesCategories).toHaveBeenCalled();
        });

        it('should set the scope.salesCategories after the promise is resolved', function() {
          scope.$digest();
          salesCategoriesDeferred.resolve();
          expect(scope.salesCategories).toBeDefined();
        });

      });

      describe('setTagsList method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setTagsList').and.callThrough();
        });

        it('should expect scope.tags to be undefined', function() {
          expect(scope.tags).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          tagsListDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setTagsList).toHaveBeenCalled();
        });

        it('should set the scope.tags after the promise is resolved', function() {
          scope.$digest();
          tagsListDeferred.resolve();
          expect(scope.tags).toBeDefined();
        });

      });

      describe('setTaxTypesList method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setTaxTypesList').and.callThrough();
        });

        it('should expect scope.taxTypes to be undefined', function() {
          expect(scope.taxTypes).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          taxTypeDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setTaxTypesList).toHaveBeenCalled();
        });

        it('should set the scope.taxTypes after the promise is resolved', function() {
          scope.$digest();
          taxTypeDeferred.resolve();
          expect(scope.taxTypes).toBeDefined();
        });

      });

      describe('setMasterCurrenciesList method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setMasterCurrenciesList').and.callThrough();
        });

        it('should expect scope.masterCurrenciesList to be undefined', function() {
          expect(scope.masterCurrenciesList).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          masterCurrenciesListDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setMasterCurrenciesList).toHaveBeenCalled();
        });

        it('should set the scope.masterCurrenciesList after the promise is resolved', function() {
          scope.$digest();
          masterCurrenciesListDeferred.resolve();
          expect(scope.masterCurrenciesList).toBeDefined();
        });

      });

      describe('setAllergens method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setAllergens').and.callThrough();
        });

        it('should expect scope.allergens to be undefined', function() {
          expect(scope.allergens).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          allergenListDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setAllergens).toHaveBeenCalled();
        });

        it('should set the scope.allergens after the promise is resolved', function() {
          scope.$digest();
          allergenListDeferred.resolve();
          expect(scope.allergens).toBeDefined();
        });

      });

      describe('setItemTypes method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setItemTypes').and.callThrough();
        });

        it('should expect scope.itemTypes to be undefined', function() {
          expect(scope.itemTypes).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          itemTypesDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setItemTypes).toHaveBeenCalled();
        });

        it('should set the scope.itemTypes after the promise is resolved', function() {
          scope.$digest();
          itemTypesDeferred.resolve();
          expect(scope.itemTypes).toBeDefined();
        });

      });

      describe('setCharacteristics method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setCharacteristics').and.callThrough();
        });

        it('should expect scope.characteristics to be undefined', function() {
          expect(scope.characteristics).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          characteristicsDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setCharacteristics).toHaveBeenCalled();
        });

        it('should set the scope.characteristics after the promise is resolved', function() {
          scope.$digest();
          characteristicsDeferred.resolve();
          expect(scope.characteristics).toBeDefined();
        });

      });

      describe('setDimensionList method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setDimensionList').and.callThrough();
        });

        it('should expect scope.dimensionUnits to be undefined', function() {
          expect(scope.dimensionUnits).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          dimensionListDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setDimensionList).toHaveBeenCalled();
        });

        it('should set the scope.dimensionUnits after the promise is resolved', function() {
          scope.$digest();
          dimensionListDeferred.resolve();
          expect(scope.dimensionUnits).toBeDefined();
        });

      });

      describe('setVolumeList method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setVolumeList').and.callThrough();
        });

        it('should expect scope.volumeUnits to be undefined', function() {
          expect(scope.volumeUnits).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          volumeListDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setVolumeList).toHaveBeenCalled();
        });

        it('should set the scope.dimensionUnits after the promise is resolved', function() {
          scope.$digest();
          volumeListDeferred.resolve();
          expect(scope.volumeUnits).toBeDefined();
        });

      });

      describe('setWeightList method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setWeightList').and.callThrough();
        });

        it('should expect scope.weightUnits to be undefined', function() {
          expect(scope.weightUnits).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          weightListDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setWeightList).toHaveBeenCalled();
        });

        it('should set the scope.weightUnits after the promise is resolved', function() {
          scope.$digest();
          weightListDeferred.resolve();
          expect(scope.weightUnits).toBeDefined();
        });

      });

      describe('setItemList method', function() {

        var idOfItemInEditMode = '383';

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setItemList').and.callThrough();
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
          expect(StockOwnerItemCreateCtrl.setItemList).toHaveBeenCalled();
        });

        it('should not delete any item from scope.substitutions if not in edit mode', function() {
            scope.$digest();
            itemsListDeferred.resolve();
            var currentItemMatch = lodash.findWhere(scope.substitutions, { id: idOfItemInEditMode });
            expect(currentItemMatch).toBeDefined();
            
        });

        it('should remove the item from scope.substitutions with id === 332 from the list', function() {
          $routeParams.id = idOfItemInEditMode;
          scope.$digest();
          itemsListDeferred.resolve();
          var currentItemMatch = lodash.findWhere(scope.substitutions, { id: idOfItemInEditMode });
          expect(currentItemMatch).not.toBeDefined();

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

        it('should set the scope.recommendations after the promise is resolved', function() {
          scope.$digest();
          itemsListDeferred.resolve();
          expect(scope.recommendations).toBeDefined();
        });

        describe('formatPayload method', function() {

          beforeEach(function() {
            spyOn(StockOwnerItemCreateCtrl, 'formatPayload');
            StockOwnerItemCreateCtrl.formatPayload();
            scope.$digest();
          });

          it('should be defined', function() {
            expect(StockOwnerItemCreateCtrl.formatPayload).toBeDefined();
          });

          it('should have be called', function() {
            expect(StockOwnerItemCreateCtrl.formatPayload).toHaveBeenCalled();
          });

        });

      });

      describe('setUIReady() method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setUIReady').and.callThrough();
        });

        it('should expect the UI ready flag to be false', function() {
          expect(scope.uiSelectTemplateReady).toBeFalsy();
        });

        it('should expect to have been called', function() {
          scope.$digest();
          expect(StockOwnerItemCreateCtrl.setUIReady).toHaveBeenCalled();
        });

        it('should expect the UI ready flag to be true after promises are resovled', function() {
          scope.$digest();
          expect(scope.uiSelectTemplateReady).toBeTruthy();
        });

      });

      describe('setBaseCurrencyId method', function() {

        beforeEach(function() {
          spyOn(StockOwnerItemCreateCtrl, 'setBaseCurrencyId').and.callThrough();
        });

        it('should expect the base currency id to undefined', function() {
          expect(StockOwnerItemCreateCtrl.baseCurrencyId).toBeUndefined();
        });

        it('should have been called after the promise is resolved', function() {
          scope.$digest();
          companyDeferred.resolve();
          expect(StockOwnerItemCreateCtrl.setBaseCurrencyId).toHaveBeenCalled();
        });

        it('should set the scope.weightUnits after the promise is resolved', function() {
          scope.$digest();
          companyDeferred.resolve();
          var baseCurrencyIdControl = responseArray[11].baseCurrencyId;
          expect(StockOwnerItemCreateCtrl.baseCurrencyId).toEqual(baseCurrencyIdControl);
        });

      });

      describe('filterCharacteristics', function() {
        it(
          'should show only Downloadable and Characteristic in item characteristics if item is Virtual',
          function() {
            var expectedCharacteristics = [{
              id: 8,
              name: 'Downloadable'
            }, {
              id: 9,
              name: 'Link'
            }];
            scope.formData.itemTypeId = 2;
            scope.characteristics = characteristics;

            scope.filterCharacteristics();

            expect(scope.filteredCharacteristics).toEqual(expectedCharacteristics);
          });
        it('should show all item characteristics if item is not Virtual', function() {
          scope.formData.itemTypeId = 1;
          scope.characteristics = characteristics;

          scope.filterCharacteristics();

          expect(scope.filteredCharacteristics).toEqual(characteristics);
        });
      });

    });

  });

  describe('submitting the form', function() {
    var formData, view, form;
    beforeEach(inject(function(_$templateCache_, _$compile_, _servedItemCreate_) {
      formData = angular.copy(_servedItemCreate_);
      view = renderView(_$templateCache_, _$compile_);
      form = angular.element(view.find('form')[0]);
      $httpBackend.expectPOST(/\/api\/retail-items/).respond(200, '');
    }));

    function mockFormSubmission(formData) {
      scope.formData = angular.copy(formData);
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
        spyOn(StockOwnerItemCreateCtrl, 'validateForm').and.callThrough();
      });

      it('should have a method attached to the controller', function() {
        expect(StockOwnerItemCreateCtrl.validateForm).toBeDefined();
      });

      it('should be called during the submission', function() {
        mockFormSubmission(formData);
        expect(StockOwnerItemCreateCtrl.validateForm).toHaveBeenCalled();
      });

      it('should set the displayError to false flag if the form is valid', function() {
        scope.form.itemTypeId.$setViewValue(2);
        scope.form.categoryId.$setViewValue(109);
        mockFormSubmission(formData);
        expect(scope.displayError).toBeFalsy();
      });

      //TODO: move into GTIN directive and test GTIN completely with mock
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
          spyOn(StockOwnerItemCreateCtrl, 'createItem').and.callThrough();
          spyOn(itemsFactory, 'createItem').and.returnValue({
            then: function(callback) {
              return callback();
            }
          });
        }));

        it('should be defined', function() {
          expect(StockOwnerItemCreateCtrl.createItem).toBeDefined();
        });

        it('should be called after form submission', function() {
          scope.form.itemTypeId.$setViewValue(2);
          scope.form.categoryId.$setViewValue(109);
          mockFormSubmission(formData);
          expect(StockOwnerItemCreateCtrl.createItem).toHaveBeenCalled();
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

    it('should have an ng-form directive', function() {
      expect(view.find('form').length).toEqual(1);
    });

    describe('UI for price', function() {

      it('should have a header', function() {
        expect(view.find('#price-and-tax').length).toEqual(1);
      });

      it('should have a header with the correct label', function() {
        expect(view.find('#price-and-tax').text()).toEqual('Price');
      });

      describe('price group button', function() {

        var priceGroupBtn;

        beforeEach(function() {
          priceGroupBtn = view.find('#add-price-group');
        });

        it('should be present in the DOM', function() {
          expect(priceGroupBtn.length).toEqual(1);
        });

        it('should have the correct label', function() {
          expect(priceGroupBtn.text().trim()).toEqual('Add Cost');
        });

        it('should have an ng-click', function() {
          expect(priceGroupBtn.attr('ng-click')).toEqual('addPriceGroup()');
        });

      });

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
      StockOwnerItemCreateCtrl.errorHandler(mockError);
    });

    it('should set error data ', function() {
      expect(scope.errorResponse).toEqual(mockError);
    });

    it('should return false', function() {
      expect(scope.displayError).toBeTruthy();
    });
    
  });

  describe('getUniqueSubstitutions function', function () {
      it('should be able to remove non active records', function () {
        var mockStockOwnerItemListResponse = [{
          itemCode: '7up123',
          itemName: '7up',
          startDate: '1999-05-10',
          endDate: '2050-05-12'
        }, {
          itemCode: '7up123',
          itemName: '7up',
          startDate: '1999-04-15',
          endDate: '2000-12-15'
        }, {
          itemCode: '7up123',
          itemName: '7up',
          startDate: '2060-12-10',
          endDate: '2061-10-15'
        }];

        
        var filteredList = StockOwnerItemCreateCtrl.getUniqueSubstitutions(mockStockOwnerItemListResponse);
        expect(filteredList.length).toEqual(1);
        expect(filteredList[0].startDate).toEqual('1999-05-10');
      });
    });
  

});
