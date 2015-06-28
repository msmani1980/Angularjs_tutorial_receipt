'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemImportCtrl
 * @description
 * # ItemImportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemImportCtrl', function ($scope, $q, ItemImportFactory, ngToast) {

    // private controller vars
    var _companyId = null,
      _airlineRetailItemCodes = [],
      _airlineRetailItemNames = [],
      _airlineRetailItemOnboardNames = [];

    // scope properties
    $scope.viewName = 'Import Stock Owner Items';

    // scope functions
    $scope.changeSelectedStockownerCompany = function () {
      if (!angular.isDefined($scope.selectedStockownerCompany)) {
        return false;
      }
      ItemImportFactory.getItemsList({companyId: $scope.selectedStockownerCompany.id}).then(function (response) {
        $scope.stockownersRetailItemList = [];
        angular.forEach(response.retailItems, function (retailItem) {
          if (canBeAddedToAirlineRetailList(retailItem)) {
            retailItem.hexColor = randomHexColorClass.get(retailItem.companyId);
            retailItem.companyName = $scope.selectedStockownerCompany.companyName;
            this.push(retailItem);
          }
        }, $scope.stockownersRetailItemList);
      });
    };

    $scope.importAll = function () {
      angular.forEach($scope.stockownersRetailItemList, function(retailItem){
        if(!canBeAddedToAirlineRetailList(retailItem)){
          return false;
        }
        if (-1 !== $scope.airlineRetailItemList.indexOf(retailItem)){
          return false;
        }
        _airlineRetailItemCodes.push(retailItem.itemCode);
        _airlineRetailItemNames.push(retailItem.itemName);
        _airlineRetailItemOnboardNames.push(retailItem.onBoardName);
        $scope.airlineRetailItemList.push(retailItem);
      });
      $scope.stockownersRetailItemList = [];
    };

    $scope.isAirlineItem = function (retailItem) {
      return retailItem.companyId === _companyId;
    };

    $scope.removeRetailItem = function (retailItem) {
      if($scope.isAirlineItem(retailItem)){
        return false;
      }
      _airlineRetailItemCodes.splice(_airlineRetailItemCodes.indexOf(retailItem.itemCode), 1);
      _airlineRetailItemNames.splice(_airlineRetailItemNames.indexOf(retailItem.itemName), 1);
      _airlineRetailItemOnboardNames.splice(_airlineRetailItemOnboardNames.indexOf(retailItem.onBoardName), 1);
      $scope.airlineRetailItemList.splice($scope.airlineRetailItemList.indexOf(retailItem), 1);
      if($scope.selectedStockownerCompany.id === retailItem.companyId) {
        $scope.stockownersRetailItemList.push(retailItem);
      }
    };

    $scope.removeAll = function () {
      var tempList = angular.copy($scope.airlineRetailItemList);
      $scope.airlineRetailItemList = [];
      _airlineRetailItemCodes = [];
      _airlineRetailItemNames = [];
      _airlineRetailItemOnboardNames = [];
      angular.forEach(tempList, function(retailItem){
        if($scope.isAirlineItem(retailItem)){
          _airlineRetailItemCodes.push(retailItem.itemCode);
          _airlineRetailItemNames.push(retailItem.itemName);
          _airlineRetailItemOnboardNames.push(retailItem.onBoardName);
          $scope.airlineRetailItemList.push(retailItem);
        }
        else if(retailItem.companyId === $scope.selectedStockownerCompany.id){
          $scope.stockownersRetailItemList.push(retailItem);
        }
      });
      tempList = null;
    };

    $scope.submitForm = function(){
      var importedRetailItemIds = [];
      angular.forEach($scope.airlineRetailItemList, function (retailItem) {
        if (!$scope.isAirlineItem(retailItem)) {
          retailItem.stockOwnerCode = retailItem.itemCode;
          importedRetailItemIds.push(parseInt(retailItem.itemMasterId));
        }
      });
      var payload = {ImportItems:{importItems: importedRetailItemIds}};
      ItemImportFactory.importItems(payload).then(function(){
        $scope.displayError = false;
        ngToast.create({
          className: 'success',
          dismissButton: true,
          content: '<strong>Item import</strong>: successful!'
        });
        constructor();
      }, function(response) {
        ngToast.create({
          className: 'warning',
          dismissButton: true,
          content: '<strong>Item import</strong>: failed!'
        });
        $scope.displayError = true;
        if ('data' in response) {
          $scope.formErrors = response.data;
        }
      });
    };

    function canBeAddedToAirlineRetailList(retailItem){
      if (-1 !== _airlineRetailItemCodes.indexOf(retailItem.itemCode)){
        return false;
      }
      if (-1 !== _airlineRetailItemNames.indexOf(retailItem.itemName)){
        return false;
      }
      if (-1 !== _airlineRetailItemOnboardNames.indexOf(retailItem.onBoardName)){
        return false;
      }
      return true;
    }

    // private controller classes
    var randomHexColorClass = {
      predefined: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FF1493', '#FFA500', '#FFD700', '#008080', '#9400D3'],
      storage: {
        items: [],
        itemColor: [],
      },
      get: function (itemId) {
        // if the company has a color saved, return it
        if (-1 !== this.storage.items.indexOf(itemId)) {
          // get com
          return this.getFromStorage(itemId);
        }
        var randColor;
        // if there are no more predefined colors, generate one
        if (!this.predefined.length) {
          randColor = this.generate();
        }
        // else choose predefined color
        else {
          var randomIndex = Math.floor(Math.random() * this.predefined.length);
          randColor = this.predefined[randomIndex];
          this.predefined.splice(randomIndex, 1);
        }
        // push company and color to storage
        this.storage.items.push(itemId);
        this.storage.itemColor.push(randColor);
        return this.getFromStorage(itemId);
      },
      getFromStorage: function (itemId) {
        return this.storage.itemColor[this.storage.items.indexOf(itemId)];
      },
      generate: function () {
        var hexPieces = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        var colorString = '#';
        for (var i = 0; i < 6; i++) {
          colorString += hexPieces[Math.floor(Math.random() * hexPieces.length)];
        }
        return colorString;
      }
    };

    // Controller constructor
    function constructor() {
      _companyId = ItemImportFactory.getCompanyId();
      _airlineRetailItemCodes = [];
      _airlineRetailItemNames = [];
      _airlineRetailItemOnboardNames = [];
      $scope.stockOwnerList = [];
      $scope.airlineRetailItemList = [];
      $scope.companiesLoaded = false;

      var getCompaniesPromise = ItemImportFactory.getCompaniesList({companyTypeId: 2, limit: null}).then(function (response) {
        // TODO - This api request queries the full list of companies until https://jira.egate-solutions.com/browse/TSVPORTAL-2038">TSVPORTAL-2038 is completed.
          angular.forEach(response.companies, function(company){
            if(2 === company.companyTypeId){
              this.push(company);
            }
          }, $scope.stockOwnerList);
        });
      var getItemsListPromise = ItemImportFactory.getItemsList({companyId: _companyId}).then(function (response) {
          $scope.airlineRetailItemList = response.retailItems;
        });
      // assign random color to all companies and items
      $q.all([getCompaniesPromise, getItemsListPromise]).then(function () {
        angular.forEach($scope.stockOwnerList, function (company) {
          company.hexColor = randomHexColorClass.get(company.id);
        });
        angular.forEach($scope.airlineRetailItemList, function (retailItem) {
          _airlineRetailItemCodes.push(retailItem.itemCode);
          _airlineRetailItemNames.push(retailItem.itemName);
          _airlineRetailItemOnboardNames.push(retailItem.onBoardName);
          $scope.airlineRetailItemList.push(retailItem);
          retailItem.hexColor = randomHexColorClass.get(retailItem.companyId);
        });
        $scope.companiesLoaded = true;
      });
    }
    constructor();

    // controller event handlers
    // TODO: documentation here: http://angular-dragdrop.github.io/angular-dragdrop/
    $scope.dropSuccessHandler = function ($event, index, array) {
      array.splice(index, 1);
    };

    $scope.onDrop = function ($event, $data, array) {
      array.push($data);
    };
    // TODO: change BACK button to back/save when models change
  });
