'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemImportCtrl
 * @description
 * # ItemImportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemImportCtrl', function ($scope, $q, ItemImportFactory) {

    // private controller vars
    var _companyId = null,
      _stockOwnerItemsFullList = [];

    // scope properties
    $scope.viewName = 'Import Stock Owner Items';

    // scope functions
    $scope.changeSelectedStockownerCompany = function () {
      $scope.stockownersRetailItemList = [];
      if (!angular.isDefined($scope.selectedStockownerCompany)) {
        return;
      }
      ItemImportFactory.getItemsList({companyId: $scope.selectedStockownerCompany.id}).then(function (response) {
        _stockOwnerItemsFullList = response.retailItems;
        setStockownersRetailItemList();
      });
    };

    $scope.importAll = function () {
      setAirlineRetailItemSkus($scope.stockownersRetailItemList);
      $scope.airlineRetailItemList = $scope.airlineRetailItemList.concat($scope.stockownersRetailItemList);
      $scope.stockownersRetailItemList = [];
    };

    $scope.isAirlineItem = function (retailItem) {
      return retailItem.companyId === _companyId;
    };

    $scope.removeRetailItem = function (retailItem) {
      if ($scope.isAirlineItem(retailItem)) {
        return;
      }
      var i = $scope.airlineRetailItemList.indexOf(retailItem);
      $scope.airlineRetailItemList.splice(i, 1);
      setStockownersRetailItemList();
    };

    $scope.removeAll = function () {
      var originalAirlineRetailItemList = [];
      angular.forEach($scope.airlineRetailItemList, function (retailItem) {
        if ($scope.isAirlineItem(retailItem)) {
          originalAirlineRetailItemList.push(retailItem);
        }
      });
      $scope.airlineRetailItemList = originalAirlineRetailItemList;
      setStockownersRetailItemList();
    };

    $scope.submitForm = function(){
      var importedRetailItems = [];
      angular.forEach($scope.airlineRetailItemList, function (retailItem) {
        if (!$scope.isAirlineItem(retailItem)) {
          retailItem.stockOwnerCode = retailItem.itemCode;
          importedRetailItems.push(retailItem);
        }
      });
      ItemImportFactory.createItem().then(function(){
        console.log('success');
      });
    };

    // private controller functions
    function setStockownersRetailItemList() {
      $scope.stockownersRetailItemList = [];
      angular.forEach(_stockOwnerItemsFullList, function (retailItem) {
        retailItem.hexColor = randomHexColorClass.get(retailItem.companyId);
        retailItem.companyName = $scope.selectedStockownerCompany.companyName;
        if (-1 === $scope.airlineRetailItemList.indexOf(retailItem)) {
          this.push(retailItem);
        }
      }, $scope.stockownersRetailItemList);
    }

    function setAirlineRetailItemSkus(retailItems) {
      angular.forEach(retailItems, function (retailItem) {
        if (-1 !== $scope.airlineRetailItemList.indexOf(retailItem)) {
          $scope.airlineRetailItemList.push(retailItem);
        }
      });
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
    (function constructor() {
      _companyId = ItemImportFactory.getCompanyId();
      var getCompaniesPromise = ItemImportFactory.getCompaniesList({companyTypeId: 2, limit: null}).then(function (response) {
        // TODO - This api request queries the full list of companies until https://jira.egate-solutions.com/browse/TSVPORTAL-2038">TSVPORTAL-2038 is completed.
          var stockownerCompanies = [];
          angular.forEach(response.companies, function(company){
            if(2 === company.companyTypeId){
              this.push(company);
            }
          }, stockownerCompanies);
          $scope.stockOwnerList = stockownerCompanies;
        });
      var getItemsListPromise = ItemImportFactory.getItemsList({companyId: _companyId}).then(function (response) {
          $scope.airlineRetailItemList = response.retailItems;
          setAirlineRetailItemSkus(response.retailItems);
        });
      // assign random color to all companies and items
      $q.all([getCompaniesPromise, getItemsListPromise]).then(function () {
        angular.forEach($scope.stockOwnerList, function (company) {
          company.hexColor = randomHexColorClass.get(company.id);
        });
        angular.forEach($scope.airlineRetailItemList, function (retailItem) {
          retailItem.hexColor = randomHexColorClass.get(retailItem.companyId);
        });
        $scope.companiesLoaded = true;
      });
    })();

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
