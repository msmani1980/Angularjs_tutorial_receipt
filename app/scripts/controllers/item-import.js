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
      _companyRetailItemCodes = [],
      _companyRetailItemNames = [],
      _companyRetailItemOnboardNames = [];

    // scope properties
    $scope.viewName = 'Import Stock Owner Items';

    // scope functions
    $scope.changeSelectedImportCompany = function () {
      if (!angular.isDefined($scope.selectedImportCompany)) {
        console.log('got here failed');
        return false;
      }
      console.log('got here');
      ItemImportFactory.getItemsList({companyId: $scope.selectedImportCompany.id}).then(function (response) {
        $scope.importedRetailItemList = [];
        angular.forEach(response.retailItems, function (retailItem) {
          if (canBeAddedToCompanyRetailList(retailItem)) {
            retailItem.hexColor = randomHexColorClass.get(retailItem.companyId);
            retailItem.companyName = $scope.selectedImportCompany.companyName;
            this.push(retailItem);
          }
        }, $scope.importedRetailItemList);
      });
    };

    $scope.importAll = function () {
      angular.forEach($scope.importedRetailItemList, function(retailItem){
        if(!canBeAddedToCompanyRetailList(retailItem)){
          return;
        }
        if (-1 !== $scope.companyRetailItemList.indexOf(retailItem)){
          return;
        }
        addRetailItemToCompanyRetailItems(retailItem);
      });
      $scope.importedRetailItemList = [];
    };

    $scope.isCompanyItem = function (retailItem) {
      return retailItem.companyId === _companyId;
    };

    $scope.removeRetailItem = function (retailItem) {
      if($scope.isCompanyItem(retailItem)){
        return false;
      }
      _companyRetailItemCodes.splice(_companyRetailItemCodes.indexOf(retailItem.itemCode), 1);
      _companyRetailItemNames.splice(_companyRetailItemNames.indexOf(retailItem.itemName), 1);
      _companyRetailItemOnboardNames.splice(_companyRetailItemOnboardNames.indexOf(retailItem.onBoardName), 1);
      $scope.companyRetailItemList.splice($scope.companyRetailItemList.indexOf(retailItem), 1);
      if($scope.selectedImportCompany.id === retailItem.companyId) {
        $scope.importedRetailItemList.push(retailItem);
      }
    };

    $scope.removeAll = function () {
      var tempList = angular.copy($scope.companyRetailItemList);
      $scope.companyRetailItemList = [];
      _companyRetailItemCodes = [];
      _companyRetailItemNames = [];
      _companyRetailItemOnboardNames = [];
      angular.forEach(tempList, function(retailItem){
        if($scope.isCompanyItem(retailItem)){
          addRetailItemToCompanyRetailItems(retailItem);
        }
        else if(retailItem.companyId === $scope.selectedImportCompany.id){
          $scope.importedRetailItemList.push(retailItem);
        }
      });
      tempList = null;
    };

    $scope.submitForm = function(){
      var importedRetailItemIds = [];
      angular.forEach($scope.companyRetailItemList, function (retailItem) {
        if (!$scope.isCompanyItem(retailItem)) {
          retailItem.stockOwnerCode = retailItem.itemCode;
          importedRetailItemIds.push(parseInt(retailItem.itemMasterId));
        }
      });
      var payload = {ImportItems:{importItems: importedRetailItemIds}};
      ItemImportFactory.importItems(payload).then(function(){
        $scope.displayError = false;
        showMessage('successful!', 'success');
        this.constructor();
      }, function(response) {
        showMessage('failed!', 'warning');
        $scope.displayError = true;
        if ('data' in response) {
          $scope.formErrors = response.data;
        }
      });
    };

    function canBeAddedToCompanyRetailList(retailItem){
      if (-1 !== _companyRetailItemCodes.indexOf(retailItem.itemCode)){
        return false;
      }
      if (-1 !== _companyRetailItemNames.indexOf(retailItem.itemName)){
        return false;
      }
      if (-1 !== _companyRetailItemOnboardNames.indexOf(retailItem.onBoardName)){
        return false;
      }
      return true;
    }

    function addRetailItemToCompanyRetailItems(retailItem){
      if(retailItem.hasOwnProperty('itemCode') && -1 === _companyRetailItemCodes.indexOf(retailItem.itemCode)) {
        _companyRetailItemCodes.push(retailItem.itemCode);
      }
      if(retailItem.hasOwnProperty('itemName') && -1 === _companyRetailItemNames.indexOf(retailItem.itemName)) {
        _companyRetailItemNames.push(retailItem.itemName);
      }
      if(retailItem.hasOwnProperty('onBoardName') && -1 === _companyRetailItemOnboardNames.indexOf(retailItem.onBoardName)) {
        _companyRetailItemOnboardNames.push(retailItem.onBoardName);
      }
      if(-1 === $scope.companyRetailItemList.indexOf(retailItem)) {
        $scope.companyRetailItemList.push(retailItem);
      }
    }

    function showMessage(message, messageType) {
      ngToast.create({ className: messageType, dismissButton: true, content: '<strong>Item import</strong>: ' + message });
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

    // controller properties
    this.constructorPromises = [];

    // Controller constructor
    this.constructor = function(){
      _companyId = ItemImportFactory.getCompanyId();
      _companyRetailItemCodes = [];
      _companyRetailItemNames = [];
      _companyRetailItemOnboardNames = [];
      $scope.importCompanyList = [];
      $scope.companyRetailItemList = [];
      $scope.companiesLoaded = false;
      this.constructorPromises = [
        ItemImportFactory.getCompaniesList({companyTypeId: 2, limit: null}).then(function (response) {
        // TODO - This api request queries the full list of companies until https://jira.egate-solutions.com/browse/TSVPORTAL-2038">TSVPORTAL-2038 is completed.
          angular.forEach(response.companies, function(company){
            if(2 === company.companyTypeId){
              this.push(company);
            }
          }, $scope.importCompanyList);
        }),
        ItemImportFactory.getItemsList({companyId: _companyId}).then(function (response) {
          $scope.companyRetailItemList = response.retailItems;
        })
      ];
      // assign random color to all companies and items
      $q.all(this.constructorPromises).then(function () {
        angular.forEach($scope.importCompanyList, function (company) {
          company.hexColor = randomHexColorClass.get(company.id);
        });
        angular.forEach($scope.companyRetailItemList, function (retailItem) {
          retailItem.hexColor = randomHexColorClass.get(retailItem.companyId);
          addRetailItemToCompanyRetailItems(retailItem);
        });
        $scope.companiesLoaded = true;
        $scope.retailItemsLoaded = true;
      });
    };
    this.constructor();

    // scope event handlers
    // TODO: documentation here: http://angular-dragdrop.github.io/angular-dragdrop/
    $scope.dropSuccessHandler = function ($event, index, array) {
      array.splice(index, 1);
    };

    $scope.onDrop = function ($event, $data, array) {
      array.push($data);
    };
    // TODO: change BACK button to back/save when models change
  });
