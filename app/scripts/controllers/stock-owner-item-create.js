'use strict';
/*global moment*/
// jshint maxcomplexity:9

/**
 * @ngdoc function
 * @name ts5App.controller:StockOwnerItemCreateCtrl
 * @description
 * # StockOwnerItemCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockOwnerItemCreateCtrl', function ($scope, $compile, ENV,
    $resource, $location, $anchorScroll, itemsFactory, companiesFactory,
    currencyFactory, $routeParams, GlobalMenuService,dateUtility) {

    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
    var companyId = GlobalMenuService.company.get();
    var $this = this;
    $scope.formData = {
      startDate: '',
      endDate: '',
      qrCodeValue: '',
      qrCodeImgUrl: null,
      images: [],
      tags: [],
      allergens: [],
      characteristics: [],
      substitutions: [],
      recommendations: [],
      globalTradeNumbers: [],
      costPrices: []
    };
    $scope.viewName = 'Create Stock Owner Item';
    $scope.buttonText = 'Create';
    $scope.itemIsActive = false;
    $scope.itemIsInactive = false;
    $scope.editingItem = false;

    this.checkIfViewOnly = function () {
      var path = $location.path();
      if (path.search('/stock-owner-item-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    this.updateViewName = function (item) {
      var prefix = 'Viewing ';
      if ($scope.editingItem) {
        prefix = 'Editing ';
      }
      $scope.viewName = prefix + item.itemName;
    };

    this.setFormAsEdit = function () {
      $scope.editingItem = true;
      $scope.buttonText = 'Save';
    };

    this.validateItemCompany = function (data) {
      return data.retailItem.companyId === companyId;
    };

    this.getItem = function (id) {

      var $this = this;

      // TODO: Make this use a loadingModal.show() method
      angular.element('#loading').modal('show').find('p')
        .text('We are getting Item ' + id);

      itemsFactory.getItem(id).then(function (data) {
        if ($this.validateItemCompany(data)) {
          $this.updateFormData(data.retailItem);
          $this.updateViewName(data.retailItem);
        } else {
          $location.path('/');
          return false;
        }
        angular.element('#loading').modal('hide');
      });

    };

    this.checkIfViewOnly();

    if ($routeParams.id && !$scope.viewOnly) {
      this.setFormAsEdit();
    }

    if ($scope.editingItem || $scope.viewOnly) {
      this.getItem($routeParams.id);
    }

    // deserialize tag object from api
    function deserializeTags(itemData) {
      for (var tagKey in itemData.tags) {
        var tag = itemData.tags[tagKey];
        itemData.tags[tagKey] = tag.tagId.toString();
      }
    }

    // deserialize characteristics object from api
    function deserializeCharacteristics(itemData) {
      for (var characteristicKey in itemData.characteristics) {
        var characteristic = itemData.characteristics[characteristicKey];
        itemData.characteristics[characteristicKey] = characteristic.characteristicId
          .toString();
      }

    }

    // deserialize allergens object from api
    function deserializeAllergens(itemData) {
      for (var allergenkey in itemData.allergens) {
        var allergen = itemData.allergens[allergenkey];
        itemData.allergens[allergenkey] = allergen.allergenId.toString();
      }
    }

    // checks to see if the item is active
    function checkIfItemIsActive(itemData) {
      var today = new Date();
      var itemStartDate = new Date(itemData.startDate);
      $scope.itemIsActive = itemStartDate <= today;
    }

    // checks to see if the item is inactive
    function checkIfItemIsInactive(itemData) {
      var today = new Date();
      var itemEndDate = new Date(itemData.endDate);
      $scope.itemIsInactive = itemEndDate <= today;
    }

    // updates the $scope.formData
    this.updateFormData = function (itemData) {
      if (!itemData) {
        return false;
      }
      itemData.startDate = formatDate(itemData.startDate, 'YYYYMMDD', 'L');
      itemData.endDate = formatDate(itemData.endDate, 'YYYYMMDD', 'L');
      checkIfItemIsInactive(itemData);
      if (!$scope.itemIsInactive) {
        checkIfItemIsActive(itemData);
      }
      deserializeTags(itemData);
      deserializeCharacteristics(itemData);
      deserializeAllergens(itemData);


      // TODO: turn this into a function
      for (var imageIndex in itemData.images) {
        var image = itemData.images[imageIndex];
        image.startDate = formatDate(image.startDate, false, 'L');
        image.endDate = formatDate(image.endDate, false, 'L');
      }

      // TODO: turn this into a function
      for (var priceIndex in itemData.costPrices) {
        var price = itemData.costPrices[priceIndex];
        price.startDate = formatDate(price.startDate, false, 'L');
        price.endDate = formatDate(price.endDate, false, 'L');
        this.updatePriceGroup(priceIndex);

      }

      $scope.formData = itemData;

    };

    // gets a list of all currencies for the item
    this.getMasterCurrenciesList = function () {
      currencyFactory.getCompanyCurrencies(function (data) {
        var masterCurrenciesList = [];
        for (var key in data.response) {
          var currency = data.response[key];
          masterCurrenciesList[currency.id] = currency.code;
        }
        $scope.masterCurrenciesList = masterCurrenciesList;
      });
    };

    // gets a list of price types for price group
    this.getPriceTypesList = function () {

      itemsFactory.getPriceTypesList(function (data) {
        $scope.priceTypes = data;
      });

    };

    this.getMasterCurrenciesList();
    this.getPriceTypesList();

    itemsFactory.getItemsList({}).then(function (data) {
      $scope.items = data.retailItems;
    });

    itemsFactory.getAllergensList(function (data) {
      $scope.allergens = data;
    });

    itemsFactory.getItemTypesList(function (data) {
      $scope.itemTypes = data;
    });

    itemsFactory.getCharacteristicsList(function (data) {
      $scope.characteristics = data;
    });

    itemsFactory.getDimensionList(function (data) {
      $scope.dimensionUnits = data.units;
    });

    itemsFactory.getVolumeList(function (data) {
      $scope.weightUnits = data.units;
    });

    itemsFactory.getWeightList(function (data) {
      $scope.volumeUnits = data.units;
    });

    companiesFactory.getTagsList(function (data) {
      $scope.tags = data.response;
    });

    companiesFactory.getSalesCategoriesList(function (data) {
      $scope.salesCategories = data.salesCategories;
    });

    companiesFactory.getTaxTypesList(function (data) {
      $scope.taxTypes = data.response;
    });

    // TODO: Move to global function
    function formatDate(dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
    }

    $scope.$watch('form.$valid', function (validity) {
      if (validity) {
        $scope.displayError = false;
      }
    });

    $scope.removeQRCode = function () {
      $scope.formData.qrCodeImgUrl = '';
      $scope.formData.qrCodeValue = '';
    };

    $scope.removeImage = function (key) {
      $scope.formData.images.splice(key, 1);
    };

    $scope.addTaxType = function () {
      $scope.formData.taxes.push({});
    };

    $scope.removeTaxType = function (key) {
      $scope.formData.taxes.splice(key, 1);
    };

    $scope.addGTIN = function () {
      $scope.formData.globalTradeNumbers.push({});
    };

    $scope.removeGTIN = function (key) {
      $scope.formData.globalTradeNumbers.splice(key, 1);
    };

    /*
     * Price Groups
     *
     */

    $scope.$watch('formData.costPrices', function(newData, oldData) {
      $this.watchPriceGroups(newData, oldData);
    }, true);

    $scope.addPriceGroup = function () {

      $scope.formData.costPrices.push({
        startDate: '',
        endDate: '',
        amount: '1.00'
      });

    };

    // Add the first price group
    $scope.addPriceGroup();

    $scope.removePriceGroup = function (key) {
      $scope.formData.costPrices.splice(key, 1);
    };

    this.getCurrencyFromArrayUsingId = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    this.setBaseCurrencyId = function(baseCurrencyId) {
      this.baseCurrencyId = baseCurrencyId;
    };

    this.getBaseCurrencyId = function() {
      companiesFactory.getCompany(companyId).then(function (response) {
        $this.setBaseCurrencyId(response.baseCurrencyId);
      });
    };

    this.getBaseCurrencyId();

    this.getCompanyGlobalCurrencies = function(priceIndex) {
      currencyFactory.getCompanyGlobalCurrencies().then(function (companyBaseCurrencyData) {
        $this.setPriceCurrenciesList(priceIndex,companyBaseCurrencyData);
      });
    };

    this.setPriceCurrenciesList = function(priceIndex,companyBaseCurrencyData) {
      var response = companyBaseCurrencyData.response;
      var baseCurrency = this.getCurrencyFromArrayUsingId(
        response,
        this.baseCurrencyId
      );
      $scope.formData.costPrices[priceIndex].code = baseCurrency.currencyCode;
    };

    this.updatePriceGroup = function(priceIndex) {
      var priceGroup = $scope.formData.costPrices[priceIndex];
      var startDate = dateUtility.formatDateForAPI(priceGroup.startDate);
      var endDate = dateUtility.formatDateForAPI(priceGroup.endDate);
      if (startDate === 'Invalid date' || endDate === 'Invalid date') {
        return false;
      }
      var currencyFilters = {
        startDate: startDate,
        endDate: endDate,
        isOperatedCurrency: true
      };
      this.getCompanyGlobalCurrencies(priceIndex,currencyFilters);
    };

    this.watchPriceGroups = function(newPrices, oldPrices) {
      if (!oldPrices) {
        return false;
      }
      for (var priceIndex in $scope.formData.costPrices) {
        this.checkPriceGroup(newPrices,oldPrices,priceIndex);
      }
    };

    this.checkPriceGroup = function(newPrices,oldPrices,priceIndex) {
      var newPriceGroup = newPrices[priceIndex];
      var oldPriceGroup = oldPrices[priceIndex];
      if (!oldPriceGroup) {
        return false;
      }
      if (newPriceGroup.startDate !== oldPriceGroup.startDate ||
        newPriceGroup.endDate !== oldPriceGroup.endDate) {
        $this.updatePriceGroup(priceIndex);
      }
    };

    // Formats the dates when sending the payload to the API
    function formatPayloadDates(itemData) {
      itemData.startDate = formatDate(itemData.startDate, 'L', 'YYYYMMDD');
      itemData.endDate = formatDate(itemData.endDate, 'L', 'YYYYMMDD');
      // TODO: Turn this into a function
      for (var imageIndex in itemData.images) {
        var image = itemData.images[imageIndex];
        image.startDate = formatDate(image.startDate, 'L', 'YYYYMMDD');
        image.endDate = formatDate(image.endDate, 'L', 'YYYYMMDD');
      }
      // TODO: Turn this into a function
      for (var priceIndex in itemData.costPrices) {
        var price = itemData.costPrices[priceIndex];
        price.startDate = formatDate(price.startDate, 'L', 'YYYYMMDD');
        price.endDate = formatDate(price.endDate, 'L', 'YYYYMMDD');
      }
    }

    // cleans up invalid properties of payload before submitting
    function cleanUpPayload(itemData) {
      for (var priceIndex in itemData.costPrices) {
        var price = itemData.costPrices[priceIndex];
        delete price.code;
      }
    }

    // formats the tags for payload
    function formatTags(itemData) {
      for (var tagKey in itemData.tags) {
        var tagId = itemData.tags[tagKey];
        itemData.tags[tagKey] = {
          tagId: tagId
        };
      }
    }

    // formats the allergens for payload
    function formatAllergens(itemData) {
      for (var allergenKey in itemData.allergens) {
        var allergenId = itemData.allergens[allergenKey];
        itemData.allergens[allergenKey] = {
          allergenId: allergenId
        };
      }
    }

    // formats the characteristics for payload
    function formatCharacteristics(itemData) {
      for (var characteristicKey in itemData.characteristics) {
        var characteristicId = itemData.characteristics[characteristicKey];
        itemData.characteristics[characteristicKey] = {
          characteristicId: characteristicId
        };
      }
    }

    this.updateItem = function (itemData) {
      var $this = this;
      angular.element('#loading').modal('show').find('p').text(
        'We are updating your item');
      var updateItemPayload = {
        retailItem: itemData
      };
      itemsFactory.updateItem($routeParams.id, updateItemPayload).then(
        function (response) {
          $this.updateFormData(response.retailItem);
          angular.element('#loading').modal('hide');
          angular.element('#update-success').modal('show');
        },
        function (response) {
          angular.element('#loading').modal('hide');
          $scope.displayError = true;
          $scope.formErrors = response.data;
        });
    };

    function createItem(itemData) {
      angular.element('#loading').modal('show').find('p').text(
        'We are creating your item');
      var newItemPayload = {
        retailItem: itemData
      };
      itemsFactory.createItem(newItemPayload).then(function () {
        angular.element('#loading').modal('hide');
        angular.element('#create-success').modal('show');
      }, function (error) {
        angular.element('#loading').modal('hide');
        $scope.displayError = true;
        $scope.formErrors = error.data;
      });
    }

    $scope.submitForm = function (formData) {

      if (!$scope.form.$valid) {
        $scope.displayError = true;
        return false;
      }
      var itemData = angular.copy(formData);
      formatTags(itemData);
      formatCharacteristics(itemData);
      formatAllergens(itemData);
      formatPayloadDates(itemData);
      cleanUpPayload(itemData);
      if ($scope.editingItem) {
        $this.updateItem(itemData);
      } else {
        createItem(itemData);
      }

    };

    $scope.isMeasurementRequired = function () {
      return ($scope.formData.width || $scope.formData.length || $scope.formData
        .height);
    };

    $scope.isMeasurementValid = function () {
      return ($scope.formData.width && $scope.formData.length && $scope.formData
        .height && $scope.formData.dimensionType);
    };

    // TODO: MOVE ME GLOBAL
    $scope.formScroll = function (id, activeBtn) {

      $scope.activeBtn = id;

      var elm = angular.element('#' + id);
      var body = angular.element('body');
      var navBar = angular.element('.navbar-header').height();
      var topBar = angular.element('.top-header').height();

      body.animate({
        scrollTop: elm.offset().top - (navBar + topBar + 100)
      }, 'slow');

      return activeBtn;

    };

  });
