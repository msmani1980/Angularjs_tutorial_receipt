'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemImportCtrl
 * @description
 * # ItemImportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemImportCtrl', function ($scope, $q, itemImportFactory, ngToast) {

    // private controller vars
    var _companyId = null,
      _companyRetailItemCodes = [],
      _companyRetailItemNames = [],
      _companyRetailItemOnboardNames = [],
      _onSaveRemoveItems = [],
      _onSaveAddItems = [],
      _removedItemCodes = [],
      _removedItemObjects = [];

    // private controller functions
    function canBeAddedToCompanyRetailList(retailItem){
      if (retailItem.itemCode && -1 !== _companyRetailItemCodes.indexOf(retailItem.itemCode)){
        return false;
      }
      if (retailItem.itemName && -1 !== _companyRetailItemNames.indexOf(retailItem.itemName.toLowerCase())){
        return false;
      }
      if (retailItem.onBoardName && -1 !== _companyRetailItemOnboardNames.indexOf(retailItem.onBoardName.toLowerCase())){
        return false;
      }
      if (-1 !== $scope.companyRetailItemList.indexOf(retailItem)){
        return false;
      }
      return true;
    }

    function removeRetailItemFromCompanyRetailItems(retailItem){
      if(!$scope.canRemove(retailItem)){
        return false;
      }
      if($scope.isCompanyItem(retailItem) && -1 === _removedItemCodes.indexOf(retailItem.itemCode)) {
        _removedItemCodes.push(retailItem.itemCode);
        _removedItemObjects.push(retailItem);
      }
      if(retailItem.itemCode) {
        _companyRetailItemCodes.splice(_companyRetailItemCodes.indexOf(retailItem.itemCode), 1);
      }
      if(retailItem.itemName) {
        _companyRetailItemNames.splice(_companyRetailItemNames.indexOf(retailItem.itemName.toLowerCase()), 1);
      }
      if(retailItem.onBoardName) {
        _companyRetailItemOnboardNames.splice(_companyRetailItemOnboardNames.indexOf(retailItem.onBoardName.toLowerCase()), 1);
      }
      $scope.companyRetailItemList.splice($scope.companyRetailItemList.indexOf(retailItem), 1);

      if($scope.isCompanyItem(retailItem) && -1 === _onSaveRemoveItems.indexOf(parseInt(retailItem.id))) {
        _onSaveRemoveItems.push(parseInt(retailItem.id));
      }
      var onSaveAddIndex = _onSaveAddItems.indexOf(parseInt(retailItem.itemMasterId));
      if(!$scope.isCompanyItem(retailItem) && -1 !== onSaveAddIndex) {
        _onSaveAddItems.splice(onSaveAddIndex, 1);
      }
      if($scope.selectedImportCompany && $scope.selectedImportCompany.id === retailItem.companyId) {
        $scope.importedRetailItemList.push(retailItem);
      }
      $scope.formChanged = formChanged();
    }

    function addRetailItemToCompanyRetailItems(retailItem){
      if(retailItem.itemCode && -1 === _companyRetailItemCodes.indexOf(retailItem.itemCode)) {
        _companyRetailItemCodes.push(retailItem.itemCode);
      }
      if(retailItem.itemName && -1 === _companyRetailItemNames.indexOf(retailItem.itemName.toLowerCase())) {
        _companyRetailItemNames.push(retailItem.itemName.toLowerCase());
      }
      if(retailItem.onBoardName && -1 === _companyRetailItemOnboardNames.indexOf(retailItem.onBoardName.toLowerCase()) && retailItem.onBoardName !== null) {
        _companyRetailItemOnboardNames.push(retailItem.onBoardName.toLowerCase());
      }
      if(-1 === $scope.companyRetailItemList.indexOf(retailItem)) {
        $scope.companyRetailItemList.push(retailItem);
      }

      if(!$scope.isCompanyItem(retailItem) && $scope.canRemove(retailItem) && -1 === _onSaveAddItems.indexOf(parseInt(retailItem.itemMasterId))) {
        _onSaveAddItems.push(parseInt(retailItem.itemMasterId));
      }

      if($scope.isCompanyItem(retailItem)) {
        var removedItemCodeIndex = _removedItemCodes.indexOf(retailItem.itemCode);
        if (-1 !== removedItemCodeIndex) {
          _removedItemCodes.splice(removedItemCodeIndex, 1);
          _removedItemObjects.splice(removedItemCodeIndex, 1);
        }
        var onSaveRemoveIndex = _onSaveRemoveItems.indexOf(parseInt(retailItem.id));
        if (-1 !== onSaveRemoveIndex) {
          _onSaveRemoveItems.splice(onSaveRemoveIndex, 1);
        }
      }
    }

    function showMessage(message, messageType) {
      ngToast.create({ className: messageType, dismissButton: true, content: '<strong>Item import</strong>: ' + message });
    }

    function formChanged(){
      return (_onSaveRemoveItems.length > 0 || _onSaveAddItems.length > 0);
    }

    function setImportedRetailItemList(response){
      $scope.importedRetailItemList = [];
      angular.forEach(response.retailItems, function (retailItem) {
        if (canBeAddedToCompanyRetailList(retailItem)) {
          var newRetailItem = angular.copy(retailItem);
          var removedItemIndex = _removedItemCodes.indexOf(retailItem.itemCode);
          if(-1 !== removedItemIndex){
            newRetailItem = angular.copy(_removedItemObjects[removedItemIndex]);
          }
          else{
            newRetailItem.hexColor = randomHexColorClass.get(retailItem.companyId);
          }
          newRetailItem.companyName = $scope.selectedImportCompany.companyName;
          this.push(newRetailItem);
          newRetailItem = null;
        }
      }, $scope.importedRetailItemList);
    }

    function setFormErrors(response){
      if ('data' in response) {
        angular.forEach(response.data,function(error){
          this.push(error);
        }, $scope.formErrors);
      }
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
    function init(){
      _companyId = itemImportFactory.getCompanyId();
      _companyRetailItemCodes = [];
      _companyRetailItemNames = [];
      _companyRetailItemOnboardNames = [];
      _onSaveRemoveItems = [];
      _onSaveAddItems = [];
      _removedItemCodes = [];
      _removedItemObjects = [];
      $scope.formErrors = [];
      $scope.importCompanyList = [];
      $scope.companyRetailItemList = [];
      $scope.companiesLoaded = false;
      $scope.selectedImportCompany = null;
      $scope.importedRetailItemList = [];
      var initPromises = [
        itemImportFactory.getCompanyList({companyTypeId: 2, limit: null}).then(function (response) {
        // TODO - This api request queries the full list of companies until https://jira.egate-solutions.com/browse/TSVPORTAL-2038">TSVPORTAL-2038 is completed.
          angular.forEach(response.companies, function(company){
            if(2 === company.companyTypeId){
              this.push(company);
            }
          }, $scope.importCompanyList);
        }),
        itemImportFactory.getItemsList({companyId: _companyId}).then(function (response) {
          $scope.companyRetailItemList = response.retailItems;
        })
      ];
      // assign random color to all companies and items
      $q.all(initPromises).then(function () {
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
    }
    init();

    // scope properties
    $scope.viewName = 'Import Stock Owner Items';

    // scope functions
    $scope.changeSelectedImportCompany = function () {
      if (!$scope.selectedImportCompany) {
        return false;
      }
      if(!$scope.selectedImportCompany.id){
        return false;
      }
      itemImportFactory.getItemsList({companyId: $scope.selectedImportCompany.id}).then(setImportedRetailItemList);
    };

    $scope.importAll = function () {
      angular.forEach($scope.importedRetailItemList, function(retailItem){
        if(!canBeAddedToCompanyRetailList(retailItem)){
          return;
        }
        addRetailItemToCompanyRetailItems(retailItem);
      });
      $scope.importedRetailItemList = [];
      $scope.formChanged = formChanged();
    };

    $scope.isCompanyItem = function (retailItem) {
      return retailItem.companyId === _companyId;
    };

    $scope.removeRetailItem = function(retailItem){
      removeRetailItemFromCompanyRetailItems(retailItem);
      $scope.changeSelectedImportCompany();
      $scope.formChanged = formChanged();
    };

    $scope.removeAll = function () {
      var tempList = angular.copy($scope.companyRetailItemList);
      angular.forEach(tempList, function(retailItem) {
        if ($scope.canRemove(retailItem)) {
          removeRetailItemFromCompanyRetailItems(retailItem);
        }
      });
      tempList = null;
      $scope.changeSelectedImportCompany();
      $scope.formChanged = formChanged();
    };

    $scope.submitForm = function(){
      if(!_onSaveAddItems.length && !_onSaveRemoveItems.length) {
        showMessage(' - Nothing has changed.', 'warning');
        return;
      }
      var submitPromises = [];
      var errors = [];

      // Batch import new items based on ID
      if(_onSaveAddItems.length) {
        var payload = {ImportItems: {importItems: _onSaveAddItems}};
        submitPromises.push(itemImportFactory.importItems(payload).then(null,setFormErrors));
      }
      // Delete items that were attached
      if(_onSaveRemoveItems.length){
        angular.forEach(_onSaveRemoveItems, function(itemId){
          submitPromises.push(itemImportFactory.removeItem(itemId).then(null,setFormErrors));
        });
      }

      // resolve the promises
      $q.all(submitPromises).then(function(){
        if(!$scope.formErrors.length){
          $scope.displayError = false;
          showMessage('saved!', 'success');
          init();
        }
        else{
          showMessage('failed!', 'warning');
          $scope.displayError = true;
        }
      });
    };

    $scope.canRemove = function(retailItem){
      return (retailItem.stockOwnerCode !== null || !$scope.isCompanyItem(retailItem));
    };

    // scope event handlers
    // TODO: documentation here: http://angular-dragdrop.github.io/angular-dragdrop/
    $scope.dropSuccessHandler = function ($event, index, array) {
      array.splice(index, 1);
    };

    $scope.onDrop = function ($event, $data, array) {
      array.push($data);
      addRetailItemToCompanyRetailItems($data);
      $scope.formChanged = formChanged();
    };
    // TODO: change BACK button to back/save when models change
  });
