'use strict';

describe('The Item Create Controller', function() {

  // load the controller's module
  beforeEach(module('ts5App', 'template-module'));
  beforeEach(module(
    'served/item.json',
    'served/item-create.json',
    'served/items-list.json',
    'served/item-types.json',
    'served/sales-categories.json',
    'served/stations-date-filtered.json',
    'served/station-exception-currencies.json',
    'served/price-types.json',
    'served/tags.json',
    'served/tax-types.json',
    'served/currencies.json',
    'served/allergens.json',
    'served/item-types.json',
    'served/characteristics.json',
    'served/units-dimension.json',
    'served/units-volume.json',
    'served/units-weight.json',
    'served/price-types.json'
  ));

  var $rootScope,
    $scope,
    $controller,
    $location,
    ItemCreateCtrl,
    $httpBackend,
    dateUtility;

  beforeEach(inject(function(_dateUtility_) {
    dateUtility = _dateUtility_;
  }));

  function createController($injector) {
    $location = $injector.get('$location');
    $location.path('/item-create');
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $scope = $rootScope.$new();
    $controller = $injector.get('$controller');
    ItemCreateCtrl = $controller('ItemCreateCtrl', {
      '$scope': $scope
    });
  }

  function renderView($templateCache, $compile) {
    var html = $templateCache.get(
      '/views/item-create.html');
    var compiled = $compile(angular.element(html))($scope);
    var view = angular.element(compiled[0]);
    $scope.$digest();
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
      expect($scope.formData).toBeDefined();
    });

    it('should have a startDate property', function() {
      expect($scope.formData.startDate).toBeDefined();
    });

    it('should have an endDate property', function() {
      expect($scope.formData.endDate).toBeDefined();
    });

    it('should have an qrCodeValue property', function() {
      expect($scope.formData.qrCodeValue).toBeDefined();
    });

    it('should have a qrCodeImgUrl property', function() {
      expect($scope.formData.qrCodeImgUrl).toBeDefined();
    });

    it('should have an taxes property that is an empty array', function() {
      expect($scope.formData.taxes).toBeDefined();
      expect($scope.formData.taxes).toEqual([]);
    });

    it('should have an tags property that is an empty array', function() {
      expect($scope.formData.tags).toBeDefined();
      expect($scope.formData.tags).toEqual([]);
    });

    it('should have an allergens property that is an empty array',
      function() {
        expect($scope.formData.allergens).toBeDefined();
        expect($scope.formData.allergens).toEqual([]);
      });

    it('should have an characteristics property that is an empty array',
      function() {
        expect($scope.formData.characteristics).toBeDefined();
        expect($scope.formData.characteristics).toEqual([]);
      });

    it('should have an substitutions property that is an empty array',
      function() {
        expect($scope.formData.substitutions).toBeDefined();
        expect($scope.formData.substitutions).toEqual([]);
      });

    it('should have an recommendations property that is an empty array',
      function() {
        expect($scope.formData.recommendations).toBeDefined();
        expect($scope.formData.recommendations).toEqual([]);
      });
    it(
      'should have an globalTradeNumbers property that is an empty array',
      function() {
        expect($scope.formData.globalTradeNumbers).toBeDefined();
        expect($scope.formData.globalTradeNumbers).toEqual([]);
      });

    it(
      'should have a prices property that is an array with one price group object inside it',
      function() {
        expect($scope.formData.prices).toBeDefined();
        expect($scope.formData.prices.length).toBe(1);
      });

    it('should have a isMeasurementValid method', function() {
      expect($scope.isMeasurementValid).toBeDefined();
    });

    it('should have a isMeasurementRequired method', function() {
      expect($scope.isMeasurementRequired).toBeDefined();
    });

  });

  describe('init() method', function() {

    it('should be defined', function() {
      expect(ItemCreateCtrl.init).toBeDefined();
    });

    describe('getDependencies() method', function() {
      var responseArray,
        companiesFactory,
        currencyFactory,
        itemsFactory,
        salesCategoriesDeferred,
        tagsListDeferred,
        taxTypeDeferred,
        masterCurrenciesListDeferred,
        allergenListDeferred,
        itemTypesDeferred,
        characteristicsDeferred,
        dimensionListDeferred,
        volumeListDeferred,
        weightListDeferred,
        priceTypeListDeferred,
        itemsListDeferred;

      beforeEach(inject(function($injector, $q, $rootScope,
        _servedSalesCategories_,
        _servedTags_, _servedTaxTypes_, _servedCurrencies_,
        _servedAllergens_, _servedItemTypes_,
        _servedCharacteristics_, _servedUnitsDimension_,
        _servedUnitsVolume_, _servedUnitsWeight_,
        _servedPriceTypes_, _servedItemsList_) {
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
          _servedItemsList_
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

        spyOn(ItemCreateCtrl, 'setSalesCategories').and.callThrough();
        spyOn(companiesFactory, 'getSalesCategoriesList').and
          .returnValue(responseArray[0]);
        spyOn(companiesFactory, 'getTagsList').and
          .returnValue(responseArray[1]);
        spyOn(companiesFactory, 'getTaxTypesList').and
          .returnValue(responseArray[2]);
        spyOn(currencyFactory, 'getCompanyCurrencies').and
          .returnValue(responseArray[3]);
        spyOn(itemsFactory, 'getAllergensList').and
          .returnValue(responseArray[4]);
        spyOn(itemsFactory, 'getItemTypesList').and
          .returnValue(responseArray[5]);
        spyOn(itemsFactory, 'getCharacteristicsList').and
          .returnValue(responseArray[6]);
        spyOn(itemsFactory, 'getDimensionList').and
          .returnValue(responseArray[7]);
        spyOn(itemsFactory, 'getVolumeList').and
          .returnValue(responseArray[8]);
        spyOn(itemsFactory, 'getWeightList').and
          .returnValue(responseArray[9]);
        spyOn(itemsFactory, 'getPriceTypesList').and
          .returnValue(responseArray[10]);
        spyOn(itemsFactory, 'getItemsList').and
          .returnValue(responseArray[11]);
        createController($injector);
      }));

      describe('setSalesCategories method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setSalesCategories').and.callThrough();
        });

        it(
          'should expect $scope.salesCategories to be undefined',
          function() {
            expect($scope.salesCategories).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            salesCategoriesDeferred.resolve();
            expect(ItemCreateCtrl.setSalesCategories).toHaveBeenCalled();
          });

        it(
          'should set the $scope.salesCategories after the promise is resolved',
          function() {
            $scope.$digest();
            salesCategoriesDeferred.resolve();
            expect($scope.salesCategories).toBeDefined();
          });

      });

      describe('setTagsList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setTagsList').and.callThrough();
        });

        it(
          'should expect $scope.tags to be undefined',
          function() {
            expect($scope.tags).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            tagsListDeferred.resolve();
            expect(ItemCreateCtrl.setTagsList).toHaveBeenCalled();
          });

        it(
          'should set the $scope.tags after the promise is resolved',
          function() {
            $scope.$digest();
            tagsListDeferred.resolve();
            expect($scope.tags).toBeDefined();
          });

      });

      describe('setTaxTypesList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setTaxTypesList').and.callThrough();
        });

        it(
          'should expect $scope.taxTypes to be undefined',
          function() {
            expect($scope.taxTypes).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            taxTypeDeferred.resolve();
            expect(ItemCreateCtrl.setTaxTypesList).toHaveBeenCalled();
          });

        it(
          'should set the $scope.taxTypes after the promise is resolved',
          function() {
            $scope.$digest();
            taxTypeDeferred.resolve();
            expect($scope.taxTypes).toBeDefined();
          });

      });

      describe('setMasterCurrenciesList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setMasterCurrenciesList').and
            .callThrough();
        });

        it(
          'should expect $scope.masterCurrenciesList to be undefined',
          function() {
            expect($scope.masterCurrenciesList).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            masterCurrenciesListDeferred.resolve();
            expect(ItemCreateCtrl.setMasterCurrenciesList).toHaveBeenCalled();
          });

        it(
          'should set the $scope.masterCurrenciesList after the promise is resolved',
          function() {
            $scope.$digest();
            masterCurrenciesListDeferred.resolve();
            expect($scope.masterCurrenciesList).toBeDefined();
          });

      });

      describe('setAllergens method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setAllergens').and.callThrough();
        });

        it(
          'should expect $scope.allergens to be undefined',
          function() {
            expect($scope.allergens).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            allergenListDeferred.resolve();
            expect(ItemCreateCtrl.setAllergens).toHaveBeenCalled();
          });

        it(
          'should set the $scope.allergens after the promise is resolved',
          function() {
            $scope.$digest();
            allergenListDeferred.resolve();
            expect($scope.allergens).toBeDefined();
          });

      });

      describe('setItemTypes method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setItemTypes').and.callThrough();
        });

        it(
          'should expect $scope.itemTypes to be undefined',
          function() {
            expect($scope.itemTypes).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            itemTypesDeferred.resolve();
            expect(ItemCreateCtrl.setItemTypes).toHaveBeenCalled();
          });

        it(
          'should set the $scope.itemTypes after the promise is resolved',
          function() {
            $scope.$digest();
            itemTypesDeferred.resolve();
            expect($scope.itemTypes).toBeDefined();
          });

      });

      describe('setCharacteristics method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setCharacteristics').and.callThrough();
        });

        it(
          'should expect $scope.characteristics to be undefined',
          function() {
            expect($scope.characteristics).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            characteristicsDeferred.resolve();
            expect(ItemCreateCtrl.setCharacteristics).toHaveBeenCalled();
          });

        it(
          'should set the $scope.characteristics after the promise is resolved',
          function() {
            $scope.$digest();
            characteristicsDeferred.resolve();
            expect($scope.characteristics).toBeDefined();
          });

      });

      describe('setDimensionList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setDimensionList').and.callThrough();
        });

        it(
          'should expect $scope.dimensionUnits to be undefined',
          function() {
            expect($scope.dimensionUnits).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            dimensionListDeferred.resolve();
            expect(ItemCreateCtrl.setDimensionList).toHaveBeenCalled();
          });

        it(
          'should set the $scope.dimensionUnits after the promise is resolved',
          function() {
            $scope.$digest();
            dimensionListDeferred.resolve();
            expect($scope.dimensionUnits).toBeDefined();
          });

      });

      describe('setVolumeList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setVolumeList').and.callThrough();
        });

        it(
          'should expect $scope.volumeUnits to be undefined',
          function() {
            expect($scope.volumeUnits).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            volumeListDeferred.resolve();
            expect(ItemCreateCtrl.setVolumeList).toHaveBeenCalled();
          });

        it(
          'should set the $scope.dimensionUnits after the promise is resolved',
          function() {
            $scope.$digest();
            volumeListDeferred.resolve();
            expect($scope.volumeUnits).toBeDefined();
          });

      });

      describe('setWeightList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setWeightList').and.callThrough();
        });

        it(
          'should expect $scope.weightUnits to be undefined',
          function() {
            expect($scope.weightUnits).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            weightListDeferred.resolve();
            expect(ItemCreateCtrl.setWeightList).toHaveBeenCalled();
          });

        it(
          'should set the $scope.weightUnits after the promise is resolved',
          function() {
            $scope.$digest();
            weightListDeferred.resolve();
            expect($scope.weightUnits).toBeDefined();
          });

      });

      describe('setItemPriceTypes method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setItemPriceTypes').and.callThrough();
        });

        it(
          'should expect $scope.priceTypes to be undefined',
          function() {
            expect($scope.priceTypes).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            priceTypeListDeferred.resolve();
            expect(ItemCreateCtrl.setItemPriceTypes).toHaveBeenCalled();
          });

        it(
          'should set the $scope.priceTypes after the promise is resolved',
          function() {
            $scope.$digest();
            priceTypeListDeferred.resolve();
            expect($scope.priceTypes).toBeDefined();
          });

      });

      describe('setItemList method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setItemList').and.callThrough();
        });

        it(
          'should expect $scope.items to be undefined',
          function() {
            expect($scope.items).toBeUndefined();
          });

        it(
          'should expect $scope.substitutions to be undefined',
          function() {
            expect($scope.substitutions).toBeUndefined();
          });

        it(
          'should expect $scope.recommendations to be undefined',
          function() {
            expect($scope.recommendations).toBeUndefined();
          });

        it(
          'should have been called after the promise is resolved',
          function() {
            $scope.$digest();
            itemsListDeferred.resolve();
            expect(ItemCreateCtrl.setItemList).toHaveBeenCalled();
          });

        it(
          'should set the $scope.items after the promise is resolved',
          function() {
            $scope.$digest();
            itemsListDeferred.resolve();
            expect($scope.items).toBeDefined();
          });

        it(
          'should set the $scope.substitutions after the promise is resolved',
          function() {
            $scope.$digest();
            itemsListDeferred.resolve();
            expect($scope.substitutions).toBeDefined();
          });

        it(
          'should set the $scope.recommendations after the promise is resolved',
          function() {
            $scope.$digest();
            itemsListDeferred.resolve();
            expect($scope.recommendations).toBeDefined();
          });

        describe('formatPayload method', function() {

          beforeEach(function() {
            spyOn(ItemCreateCtrl, 'formatPayload');
            ItemCreateCtrl.formatPayload();
            $scope.$digest();
          });

          it('should be defined', function() {
            expect(ItemCreateCtrl.formatPayload).toBeDefined();
          });

          it('should have be called', function() {
            expect(ItemCreateCtrl.formatPayload).toHaveBeenCalled();
          });

        });

      });

      describe('setUIReady() method', function() {

        beforeEach(function() {
          spyOn(ItemCreateCtrl, 'setUIReady').and.callThrough();
        });

        it('should expect the UI ready flag to be false', function() {
          expect($scope.uiSelectTemplateReady).toBeFalsy();
        });

        it('should expect to have been called', function() {
          $scope.$digest();
          expect(ItemCreateCtrl.setUIReady).toHaveBeenCalled();
        });

        it('should expect the UI ready flag to be true after promises are resovled', function() {
          $scope.$digest();
          expect($scope.uiSelectTemplateReady).toBeTruthy();
        });

      });

    });

  });

  describe('submitting the form', function() {
    var formData,
      view,
      form;
    beforeEach(inject(function(_$templateCache_, _$compile_,
      _servedItemCreate_) {
      formData = _servedItemCreate_;
      view = renderView(_$templateCache_, _$compile_);
      form = angular.element(view.find('form')[0]);
      $httpBackend.expectPOST(/\/api\/retail-items/).respond(200,
        '');
    }));

    function mockFormSubmission(formData) {
      form.triggerHandler('submit');
      $scope.submitForm(formData);
      $scope.$digest();
    }

    it('should have a submitForm() method attached to the scope',
      function() {
        expect($scope.submitForm).toBeDefined();
      });

    it('should set the form submitted flag when called',
      function() {
        expect($scope.form.$submitted).toBeFalsy();
        mockFormSubmission(formData);
        expect($scope.form.$submitted).toBeTruthy();
      });

    describe('validating the form', function() {

      beforeEach(function() {
        spyOn(ItemCreateCtrl, 'validateForm').and.callThrough();
      });

      it('should have a method attached to the controller',
        function() {
          expect(ItemCreateCtrl.validateForm).toBeDefined();
        });

      it('should be called during the submission',
        function() {
          mockFormSubmission(formData);
          expect(ItemCreateCtrl.validateForm).toHaveBeenCalled();
        });

      it(
        'should set the displayError to false flag if the form is valid',
        function() {
          expect($scope.displayError).toBeFalsy();
          $scope.form.itemTypeId.$setViewValue(2);
          $scope.form.categoryId.$setViewValue(109);
          mockFormSubmission(formData);
          expect($scope.displayError).toBeFalsy();
        });

      it(
        'should set the displayError to true if the form is invalid',
        function() {
          expect($scope.displayError).toBeFalsy();
          $scope.form.itemTypeId.$setViewValue(null);
          $scope.form.categoryId.$setViewValue(null);
          mockFormSubmission(formData);
          expect($scope.displayError).toBeTruthy();
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

        it('should be called after form submission', function() {
          $scope.form.itemTypeId.$setViewValue(2);
          $scope.form.categoryId.$setViewValue(109);
          mockFormSubmission(formData);
          expect(ItemCreateCtrl.createItem).toHaveBeenCalled();
        });

        it('should return true if item was created',
          function() {
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
      expect(view.find('ng-form').length).toEqual(1);
    });

    describe('UI for price and tax', function() {

      it('should have a header', function() {
        expect(view.find('#price-and-tax').length).toEqual(1);
      });

      it('should have a header with the correct label', function() {
        expect(view.find('#price-and-tax').text()).toEqual(
          'Price & Tax');
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
          expect(priceGroupBtn.text().trim()).toEqual(
            'Add Price Type');
        });

        it('should have an ng-click', function() {
          expect(priceGroupBtn.attr('ng-click')).toEqual(
            'addPriceGroup()');
        });

      });

      describe('tax type button', function() {

        var taxTypeBtn;

        beforeEach(function() {
          taxTypeBtn = view.find('#add-tax-type');
        });

        it('should be present in the DOM', function() {
          expect(taxTypeBtn.length).toEqual(1);
        });

        it('should have the correct label', function() {
          expect(taxTypeBtn.text().trim()).toEqual(
            'Add Tax Type');
        });

        it('should have an ng-click', function() {
          expect(taxTypeBtn.attr('ng-click')).toEqual(
            'addTaxType()');
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
      var priceGroup = $scope.formData.prices[0];
      expect(priceGroup).toBeDefined();
    });

    describe('addPriceGroup()', function() {

      it('should be able to add a price group to the prices array', function() {
        $scope.addPriceGroup();
        expect($scope.formData.prices.length).toBe(2);
      });

      it('should create the correct price group data set', function() {
        $scope.addPriceGroup();
        var priceGroup = $scope.formData.prices[1];
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
        $scope.removePriceGroup(0);
        expect($scope.formData.prices.length).toBe(0);
      });

    });

    describe('watchPriceGroups()', function() {

      var currenciesListJSON,
        getCurrenciesListDeferred,
        currencyFactory,
        priceGroup;

      function mockDateChange() {
        $scope.$digest();
        var priceGroup = $scope.formData.prices[0];
        priceGroup.startDate = dateUtility.nowFormatted();
        priceGroup.endDate = dateUtility.nowFormatted();
        $scope.$digest();
      }

      beforeEach(inject(function($q, $injector, _servedCurrencies_) {
        priceGroup = $scope.formData.prices[0];
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

        beforeEach(function() {
          priceGroup = $scope.formData.prices[0];
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
          var controlPriceList = ItemCreateCtrl.generatePriceCurrenciesList(currenciesListJSON.response);
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

    var stationsJSON,
      stationException;

    beforeEach(inject(function($injector) {
      createController($injector);
      $scope.addStationException(0);

    }));

    it('should be have a addStationException method', function() {
      expect($scope.addStationException).toBeDefined();
    });

    it('should be able to add a stationException to the price group',
      function() {

        expect($scope.formData.prices[0].stationExceptions.length).toBe(
          1);

        stationException = $scope.formData.prices[0].stationExceptions[
          0];

        expect(stationException.startDate).toBeDefined();

        expect(stationException.endDate).toBeDefined();

        expect(stationException.stationExceptionCurrencies).toBeDefined();

        expect(stationException.stationExceptionCurrencies).toEqual(
          []);

      });

    it('should be have a removeStationException method', function() {
      expect($scope.removeStationException).toBeDefined();
    });

    it(
      'should be able to remove a stationException from the price group',
      function() {

        expect($scope.formData.prices[0].stationExceptions.length).toBe(
          1);

        $scope.removeStationException(0);

        expect($scope.formData.prices[0].stationExceptions.length).toBe(
          0);

      });

    it('should be have a getGlobalStationList method', function() {
      expect(ItemCreateCtrl.getGlobalStationList).toBeDefined();
    });

    describe('The ItemCreateCtrl.getGlobalStationList method',
      function() {

        var response,
          testObject;

        beforeEach(inject(function() {

          inject(function(_servedStationsDateFiltered_) {
            stationsJSON = _servedStationsDateFiltered_;
          });

          // spy on the query of the items service
          spyOn(ItemCreateCtrl, 'getGlobalStationList').and.callFake(
            function() {
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

        it(
          'should return a response from the API containg a response array',
          function() {
            expect(response.response).toBeDefined();
          });

        it(
          'should return an array of stations containing at least station',
          function() {
            expect(response.response.length).toBeGreaterThan(0);
          });

        it('should contain a station object with a station code',
          function() {
            expect(testObject.code).toBeDefined();
            expect(testObject.code).toEqual(jasmine.any(String));
            expect(testObject.code.length).toEqual(3);
          });

        it('should contain a station object with a station id',
          function() {
            expect(testObject.id).toBeDefined();
            expect(testObject.id).toEqual(jasmine.any(Number));
          });

        it('should contain a station object with a company id',
          function() {
            expect(testObject.companyId).toBeDefined();
            expect(testObject.companyId).toEqual(jasmine.any(
              Number));
          });

      });

    it('should be have a setStationsList method', function() {
      expect(ItemCreateCtrl.setStationsList).toBeDefined();
    });

    describe('The ItemCreateCtrl.setStationsList method', function() {

      var station;

      beforeEach(inject(function() {

        $scope.addStationException(0);

        inject(function(_servedStationsDateFiltered_) {
          stationsJSON = _servedStationsDateFiltered_;
        });

        spyOn(ItemCreateCtrl, 'setStationsList').and.callThrough();

        stationException = $scope.formData.prices[0].stationExceptions[
          0];

        ItemCreateCtrl.setStationsList(stationException,
          stationsJSON);

        station = stationException.stations[0];

      }));

      it('should have been called', function() {
        expect(ItemCreateCtrl.setStationsList).toHaveBeenCalled();
      });

      it('should have a stations collection', function() {
        expect(stationException.stations).toBeDefined();
        expect(stationException.stations.length).toBeGreaterThan(
          0);
      });


      it('should contain a station object with a station code',
        function() {
          expect(station.code).toBeDefined();
          expect(station.code).toEqual(jasmine.any(String));
          expect(station.code.length).toEqual(3);
        });

      it('should contain a station object with a station id',
        function() {
          expect(station.id).toBeDefined();
          expect(station.id).toEqual(jasmine.any(Number));
        });

      it('should contain a station object with a company id',
        function() {
          expect(station.companyId).toBeDefined();
          expect(station.companyId).toEqual(jasmine.any(Number));
        });

    });

    it('should be have a getStationsCurrenciesList method', function() {
      expect(ItemCreateCtrl.getStationsCurrenciesList).toBeDefined();
    });

    describe('The ItemCreateCtrl.getStationsCurrenciesList method',
      function() {

        var stationExceptionCurrenciesJSON,
          response,
          testObject;

        beforeEach(inject(function() {

          inject(function(_servedStationExceptionCurrencies_) {
            stationExceptionCurrenciesJSON =
              _servedStationExceptionCurrencies_;
          });

          // spy on the query of the items service
          spyOn(ItemCreateCtrl, 'getStationsCurrenciesList').and
            .callFake(function() {
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

        it(
          'should return a response from the API containg a response array',
          function() {
            expect(response.response).toBeDefined();
          });

        it(
          'should return an array of stations currencies containing at least station currency',
          function() {
            expect(response.response.length).toBeGreaterThan(0);
          });

        it(
          'should contain a station currency object with a station code',
          function() {
            expect(testObject.code).toBeDefined();
            expect(testObject.code).toEqual(jasmine.any(String));
            expect(testObject.code.length).toEqual(3);
          });

        it(
          'should contain a station currency object with a station id',
          function() {
            expect(testObject.id).toBeDefined();
            expect(testObject.id).toEqual(jasmine.any(Number));
          });

        it(
          'should contain a station currency object with a company id',
          function() {
            expect(testObject.companyId).toBeDefined();
            expect(testObject.companyId).toEqual(jasmine.any(
              Number));
          });

      });

    it('should be have a setStationsCurrenciesList method', function() {
      expect(ItemCreateCtrl.setStationsCurrenciesList).toBeDefined();
    });

    describe('The ItemCreateCtrl.setStationsCurrenciesList method',
      function() {

        var stationExceptionCurrenciesJSON;

        beforeEach(inject(function() {

          $scope.addStationException(0);

          inject(function(_servedStationExceptionCurrencies_) {
            stationExceptionCurrenciesJSON =
              _servedStationExceptionCurrencies_;
          });

          spyOn(ItemCreateCtrl, 'setStationsCurrenciesList').and
            .callThrough();

          stationException = $scope.formData.prices[0].stationExceptions[
            0];

          ItemCreateCtrl.setStationsCurrenciesList(
            stationException,
            stationExceptionCurrenciesJSON);

        }));

        it('should have been called', function() {
          expect(ItemCreateCtrl.setStationsCurrenciesList).toHaveBeenCalled();
        });

        it('should have a stationExceptionCurrencies collection',
          function() {
            expect(stationException.stationExceptionCurrencies).toBeDefined();
            expect(stationException.stationExceptionCurrencies.length)
              .toBeGreaterThan(0);
          });

      });

    it('should be have a generateStationCurrenciesList method',
      function() {
        expect(ItemCreateCtrl.generateStationCurrenciesList).toBeDefined();
      });

    describe(
      'The ItemCreateCtrl.generateStationCurrenciesList method',
      function() {

        var stationExceptionCurrency,
          stationExceptionCurrenciesJSON,
          stationExceptionCurrenciesList;

        beforeEach(inject(function() {

          $scope.addStationException(0);

          inject(function(_servedStationExceptionCurrencies_) {
            stationExceptionCurrenciesJSON =
              _servedStationExceptionCurrencies_;
          });

          spyOn(ItemCreateCtrl,
              'generateStationCurrenciesList')
            .and.callThrough();

          stationException = $scope.formData.prices[0].stationExceptions[
            0];

          stationExceptionCurrenciesList = ItemCreateCtrl.generateStationCurrenciesList(
            stationExceptionCurrenciesJSON);

          stationExceptionCurrency =
            stationExceptionCurrenciesList[0];

        }));

        it('should have been called', function() {
          expect(ItemCreateCtrl.generateStationCurrenciesList).toHaveBeenCalled();
        });

        it(
          'should generate a stationExceptionCurrencies collection',
          function() {
            expect(stationExceptionCurrenciesList).toBeDefined();
            expect(stationExceptionCurrenciesList.length).toBeGreaterThan(
              0);
          });


        it(
          'should contain a stationExceptionCurrency object with a currency code',
          function() {
            expect(stationExceptionCurrency.price).toBeDefined();
            expect(stationExceptionCurrency.price).toEqual('1.00');
          });

        it(
          'should contain a stationExceptionCurrency object with a companyCurrencyId',
          function() {
            expect(stationExceptionCurrency.companyCurrencyId).toBeDefined();
            expect(stationExceptionCurrency.companyCurrencyId).toEqual(
              jasmine.any(Number));
          });

      });

    it('should be have a updateStationException method', function() {
      expect(ItemCreateCtrl.updateStationException).toBeDefined();
    });

    describe('The ItemCreateCtrl.updateStationException method',
      function() {

        beforeEach(inject(function() {

          $scope.addStationException(0);

          spyOn(ItemCreateCtrl, 'getGlobalStationList').and.callThrough();

          spyOn(ItemCreateCtrl, 'getStationsCurrenciesList').and
            .callThrough();

          spyOn(ItemCreateCtrl, 'updateStationException').and
            .callThrough();

          stationException = $scope.formData.prices[0].stationExceptions[
            0];

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

    // TODO: Finish the handleStationPromises test cases
    it('should be have a handleStationPromises method', function() {
      expect(ItemCreateCtrl.handleStationPromises).toBeDefined();
    });

  });

  describe('$scope.uiSelectTemplateReady variable', function() {

    it('should be defined', function() {
      expect($scope.uiSelectTemplateReady).toBeDefined();
    });

    it('should return false', function() {
      expect($scope.uiSelectTemplateReady).toBeFalsy();
    });

  });



});
