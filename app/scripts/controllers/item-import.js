'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ItemImportCtrl
 * @description
 * # ItemImportCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ItemImportCtrl',
    function ($scope, $q, $filter, itemImportFactory, messageService, dateUtility, companyRelationshipService, globalMenuService) {

      // private controller vars
      var companyId = null;
      var companyRetailItems = null;
      var initPromises = null;
      var importedRetailList = null;

      // private controller functions
      function canBeAddedToCompanyRetailList(retailItem) {
        if (dateUtility.isTodayOrEarlierDatePicker(retailItem.endDate)) {
          return false;
        }

        if ($filter('filter')(companyRetailItems, {
            itemCode: retailItem.itemCode
          }, true).length) {
          return false;
        }

        if ($filter('filter')(companyRetailItems, {
            itemName: retailItem.itemName
          }, true).length) {
          return false;
        }

        return !(retailItem.onBoardName !== null && $filter('filter')(companyRetailItems, {
          onBoardName: retailItem.onBoardName
        }, true).length);

      }

      function addToImportedRetailItemList(retailItem) {
        if (!$scope.selectedImportCompany) {
          return;
        }

        if (!$scope.selectedImportCompany.id) {
          return;
        }

        if ($scope.selectedImportCompany.id !== retailItem.companyId) {
          return;
        }

        $scope.importedRetailItemList.push(retailItem);
      }

      function removeRetailItemFromCompanyItems(retailItem) {
        $scope.companyRetailItemList.splice($scope.companyRetailItemList.indexOf(retailItem), 1);
        companyRetailItems.splice(companyRetailItems.indexOf(retailItem), 1);
        addToImportedRetailItemList(retailItem);
      }

      function addRetailItemToCompanyItems(retailItem, onlyIndex, atIndex) {
        if (!canBeAddedToCompanyRetailList(retailItem)) {
          return;
        }

        companyRetailItems.push(retailItem);
        if (onlyIndex) {
          return;
        }

        if (-1 !== $scope.companyRetailItemList.indexOf(retailItem)) {
          return;
        }

        if (atIndex >= 0) {
          $scope.companyRetailItemList.splice(atIndex, 0, retailItem);
        } else {
          $scope.companyRetailItemList.push(retailItem);
        }
      }

      function showMessage(message, messageType) {
        messageService.display(messageType, '<strong>Item import</strong>: ' + message);
      }

      function displayLoadingModal(loadingText) {
        angular.element('#loading').modal('show').find('p').text(loadingText);
      }

      function hideLoadingModal() {
        angular.element('#loading').modal('hide');
      }

      function showFormErrors(dataFromAPI) {
        hideLoadingModal();
        $scope.displayError = true;
        $scope.errorResponse = dataFromAPI;
      }

      function setRelationshipData(companyListFromAPI) {
        angular.forEach(angular.copy(companyListFromAPI.companyRelationships), function (company) {
          var companyData = {
            companyName: company.relativeCompany,
            id: company.relativeCompanyId
          };
          $scope.importCompanyList.push(companyData);
        });
      }

      function getRelatedCompanyList() {
        var companyId = globalMenuService.company.get();
        var today = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
        var payload = {
          startDate: today,
          endDate: '20501231',
          relativeCompanyType: 'Stockowner'
        };
        companyRelationshipService.getCompanyRelationshipListByCompany(companyId, payload).then(setRelationshipData);
      }

      function setGetItemsListPromise() {
        initPromises.push(itemImportFactory.getItemsList({
          companyId: companyId
        }).then(function (response) {
          companyRetailItems = response.retailItems;
        }));
      }

      // private controller classes
      var randomHexColorClass = {
        predefined: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FF1493', '#FFA500',
          '#FFD700', '#008080', '#9400D3'
        ],
        storage: {
          items: [],
          itemColor: []
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

      function setImportedRetailItemList(response) {
        importedRetailList = response.retailItems;
        $scope.importedRetailItemList = [];
        angular.forEach(importedRetailList, function (retailItem) {
          if (canBeAddedToCompanyRetailList(retailItem)) {
            retailItem.hexColor = randomHexColorClass.get(retailItem.companyId);
            retailItem.companyName = $scope.selectedImportCompany.companyName;
            addToImportedRetailItemList(retailItem);
          }
        });

        $scope.showLeftDropZoneMessage = ($scope.importedRetailItemList.length);
        $scope.showRightDropZoneMessage = (!$scope.importedRetailItemList.length);
        hideLoadingModal();
      }

      function resolveInitPromises() {
        $q.all(initPromises).then(function () {
          angular.forEach($scope.importCompanyList, function (company) {
            company.hexColor = randomHexColorClass.get(company.id);
          });

          $scope.companiesLoaded = true;
          $scope.retailItemsLoaded = true;
          hideLoadingModal();
        }, showFormErrors);
      }

      // Controller constructor
      function init() {
        companyId = itemImportFactory.getCompanyId();
        companyRetailItems = [];
        initPromises = [];
        importedRetailList = [];
        $scope.formErrors = [];
        $scope.importCompanyList = [];
        $scope.companyRetailItemList = [];
        $scope.companiesLoaded = false;
        $scope.selectedImportCompany = null;
        $scope.importedRetailItemList = [];
        $scope.retailItemsSortOrder = null;
        $scope.importItemsSortOrder = null;

        displayLoadingModal('Loading');
        getRelatedCompanyList();
        setGetItemsListPromise();
        resolveInitPromises();

      }

      init();

      // scope properties
      $scope.viewName = 'Import Stock Owner Items';

      // scope functions
      $scope.changeSelectedImportCompany = function () {
        if (!$scope.selectedImportCompany) {
          return false;
        }

        if (!$scope.selectedImportCompany.id) {
          return false;
        }

        displayLoadingModal('Loading');
        var today = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
        itemImportFactory.getItemsList({
          companyId: $scope.selectedImportCompany.id,
          startDate: today
        }).then(setImportedRetailItemList);
      };

      $scope.importAll = function () {
        $scope.searchCompanyRetailItemList = null;
        angular.forEach($scope.importedRetailItemList, function (retailItem) {
          if (!canBeAddedToCompanyRetailList(retailItem)) {
            return;
          }

          addRetailItemToCompanyItems(retailItem);
        });

        $scope.importedRetailItemList = [];
      };

      $scope.removeRetailItem = function (retailItem) {
        removeRetailItemFromCompanyItems(retailItem);
      };

      $scope.removeAll = function () {
        var currentList = angular.copy($scope.companyRetailItemList);
        angular.forEach(currentList, function (retailItem) {
          removeRetailItemFromCompanyItems(retailItem);
        });
      };

      $scope.submitForm = function () {
        if (!$scope.companyRetailItemList.length) {
          return;
        }

        displayLoadingModal('Saving');

        var importIds = [];
        angular.forEach($scope.companyRetailItemList, function (retailItem) {
          this.push(retailItem.itemMasterId);
        }, importIds);

        var payload = {
          ImportItems: {
            importItems: importIds
          }
        };
        itemImportFactory.importItems(payload).then(function () {
          $scope.displayError = false;
          showMessage('saved!', 'success');
          init();
          hideLoadingModal();
        }, showFormErrors);

      };

      // scope event handlers
      // TODO: documentation here: http://angular-dragdrop.github.io/angular-dragdrop/
      $scope.dropSuccessImportedRetailItemList = function ($event, index, array) {
        $event.preventDefault();
        array.splice(index, 1);
      };

      $scope.onDropCompanyRetailItemList = function ($event, $data) {
        var index = $scope.companyRetailItemList.length;
        $scope.companyRetailItemList = $filter('orderBy')($scope.companyRetailItemList, $scope.retailItemsSortOrder);
        $scope.retailItemsSortOrder = null;
        $scope.searchCompanyRetailItemList = null;
        if ($event.currentTarget.id !== 'company-retail-item-list-drop-init') {
          var targetRetailItem = angular.element($event.currentTarget).scope().retailItem;
          index = $scope.companyRetailItemList.indexOf(targetRetailItem);
        }

        addRetailItemToCompanyItems($data, false, index);
        if ($scope.showLeftDropZoneMessage) {
          $scope.showLeftDropZoneMessage = false;
        }
      };

      $scope.dropSuccessCompanyRetailItemList = function ($event, index) {
        $event.preventDefault();
        var retailItem = $scope.companyRetailItemList[index];
        removeRetailItemFromCompanyItems(retailItem);
      };

      $scope.nullOperation = function ($event) {
        $event.preventDefault();
        return false;
      };
    });
