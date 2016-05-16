'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposVirtualCtrl
 * @description
 * # ManualEposVirtualCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposItemsCtrl', function ($scope, $q, $routeParams, manualEposFactory, lodash, dateUtility, globalMenuService) {
    
    function setItemList(masterItemList, cashBagItemList) {
      $scope.itemList = [];

      angular.forEach(masterItemList, function (item) {
        var newItemObject = {
          itemName: item.itemName,
          itemCode: item.itemCode,
          itemMasterId: item.id
        };

        var cashBagItemMatch = lodash.findWhere(cashBagItemList, { itemMasterId: item.id });
        if (cashBagItemMatch) {
          newItemObject.currencyId = cashBagItemMatch.currencyId;
          newItemObject.amount = cashBagItemMatch.amount;
          newItemObject.quantity = cashBagItemMatch.quantity;
        }
      });
    }

    function setBaseCurrency(currencyList) {
      $scope.baseCurrency = {};
      $scope.baseCurrency.currencyId = globalMenuService.getCompanyData().baseCurrencyId;
      $scope.baseCurrency.currencyCode = lodash.findWhere(currencyList, { id: $scope.baseCurrency.currencyId });
    }

    function completeInit(responseCollection) {
      var masterItemList = angular.copy(responseCollection[0].masterItems);
      var cashBagItemList = angular.copy(responseCollection[1].response);
      var currencyList = angular.copy(responseCollection[2]);

      setBaseCurrency(currencyList);
      setItemList(masterItemList, cashBagItemList);
    }

    function makeSecondInitPromises() {
      var dateForFilter = dateUtility.formatDateForAPI(dateUtility.formatDateForApp($scope.storeInstance.scheduleDate));
      var currencyPayload = {
        startDate: dateForFilter,
        endDate: dateForFilter
      };

      var itemListPayload = angular.extend(angular.copy(currencyPayload), { itemTypeId: $scope.mainItemType.id });

      var promises = [
        manualEposFactory.getRetailItems(itemListPayload),
        manualEposFactory.getCashBagItemList($routeParams.cashBagId),
        manualEposFactory.getCurrencyList(currencyPayload)
      ];

      return promises;
    }

    function completeInitCalls(dataFromAPI) {
      $scope.storeInstance = angular.copy(dataFromAPI);
      var secondInitPromises = makeSecondInitPromises();
      $q.all(secondInitPromises).then(completeInit);
    }

    function setInitVarsAndGetStoreInstance(responseCollection) {
      $scope.cashBag = angular.copy(responseCollection[0]);
      var itemTypes = angular.copy(responseCollection[1]);
      var capitalizedItemType = $routeParams.itemType.charAt(0).toUpperCase() + $routeParams.itemType.slice(1).toLowerCase();
      $scope.mainItemType = lodash.findWhere(itemTypes, { name: capitalizedItemType }) || '';

      manualEposFactory.getStoreInstance($scope.cashBag.storeInstanceId).then(completeInitCalls);
    }

    function init() {
      var firstInitPromises = [
        manualEposFactory.getCashBag($routeParams.cashBagId),
        manualEposFactory.getItemTypes()
      ];

      $q.all(firstInitPromises).then(setInitVarsAndGetStoreInstance);
    }

    init();
  });
