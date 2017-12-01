'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuRuleCreateCtrl
 * @description
 * # MenuRuleCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuRuleCreateCtrl', function ($scope, dateUtility, messageService, menuRulesFactory, menuMasterService, $location, $routeParams, $q, _, lodash) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Rule Management';
    $scope.readOnly = false;
    $scope.isEdit = false;
    $scope.schedules = [];
    $scope.menuRule = { };
    $scope.carrierTypes = [];
    $scope.items = [];
    $scope.menuMasters = [];
    $scope.categories = [];
    $scope.companyCabinClasses = [];
    $scope.daysOfOperation = [
      { id: 1, name: 'Monday' },
      { id: 2, name: 'Tuesday' },
      { id: 3, name: 'Wednesday' },
      { id: 4, name: 'Thursday' },
      { id: 5, name: 'Friday' },
      { id: 6, name: 'Saturday' },
      { id: 7, name: 'Sunday' }
    ];
    $scope.formData = {
      selectedMenus: [],
      selectedItems: []
    };

    $scope.addMenu = function (cabinClass) {
      $scope.formData.selectedMenus[cabinClass].push({ });
    };

    $scope.removeMenu = function (cabinClass, menu) {
      var index = $scope.formData.selectedMenus[cabinClass].indexOf(menu);
      $scope.formData.selectedMenus[cabinClass].splice(index, 1);
    };

    $scope.addItem = function (cabinClass) {
      $scope.formData.selectedItems[cabinClass].push({ items: $scope.items });
    };

    $scope.removeItem = function (cabinClass, menu) {
      var index = $scope.formData.selectedItems[cabinClass].indexOf(menu);
      $scope.formData.selectedItems[cabinClass].splice(index, 1);
    };
    
    $this.getRetailItemsByCategoryResponse = function (dataFromAPI) {
      return angular.copy(dataFromAPI.masterItems);
    };
    
    $scope.filterItemListByCategory = function (item) {
      //item.items = menuRulesFactory.getItemsList({ categoryId: item.selectedCategory.id }, { fetchFromMaster: 'master' }).then($this.getRetailItemsByCategoryResponse);
      item.items = (item.selectedCategory) ? lodash.filter($scope.items, { categoryName: item.selectedCategory.name }) : $scope.items;
    };

    $scope.formSave = function () {
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'MenuRules');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

    this.validateForm = function() {
      $scope.displayError = !$scope.menuRuleDataForm.$valid;
      return $scope.menuRuleDataForm.$valid;
    };
    
    this.createMenuRules = function() {
      $this.showLoadingModal('Saving Menu Rules Data');

      var payloadMenus = [];
      var payloadItems = [];

      $scope.formData.selectedMenus.forEach(function (menus, cabinClass) {
        menus.forEach(function (menu) {
          payloadMenus.push({
            menuQty: menu.menuQty,
            menuId: menu.menu.menuId,
            companyCabinClassId: cabinClass
          });
        });
      });

      $scope.formData.selectedItems.forEach(function (items, cabinClass) {
        items.forEach(function (item) {
          payloadItems.push({
            itemQty: item.itemQty,
            itemId: item.item.id,
            companyCabinClassId: cabinClass
          });
        });
      });
      
      var daysArray = [];
      angular.forEach($scope.formData.days, function(element) {
        daysArray.push(element.id);
      });

      var payload = {
        scheduleNumber: $scope.formData.scheduleNumber,
        days: daysArray,
        departureStationId: $scope.formData.departureStationId,
        arrivalStationId: $scope.formData.arrivalStationId,
        departureTimeFrom: $scope.formData.departureTime,
        departureTimeTo: $scope.formData.departureTime,
        startDate: dateUtility.formatDateForAPI($scope.formData.startDate),
        endDate: dateUtility.formatDateForAPI($scope.formData.endDate),
        cabins: this.constructSelectedMenusItems(payloadItems, payloadMenus)
      };

      menuRulesFactory.createMenuRule(payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };
    
    this.constructSelectedMenusItems = function(payloadItems, payloadMenus) {
      var payloadItemsMap = _.chain(payloadItems).groupBy('companyCabinClassId').map((items, companyCabinClassId) => ({ companyCabinClassId, items })).value();
      var payloaMenusMap = _.chain(payloadMenus).groupBy('companyCabinClassId').map((menus, companyCabinClassId) => ({ companyCabinClassId, menus })).value();
      var mergedArray = _.zip(payloadItemsMap, payloaMenusMap);
      
      var finalMenusItems = [];
      angular.forEach(mergedArray, function (rootVal, rootKey) {
        angular.forEach(rootVal, function (value, key) {
          finalMenusItems.push(value);
        });
      });
      
      return finalMenusItems;
    };
    
    this.editMenuRules = function() {
      $this.showLoadingModal('Updating Menu Rules Data');
    };
  
    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.saveFormSuccess = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('success', 'Edit Menu Rule', 'success');
      $location.path('menu-rules');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };
        
    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };
    
    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.viewName = 'Rule Management';
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Rules';
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Rules';
      $scope.isEdit = true;
    };
      
    this.getMenuMasterAndItemsListSuccess = function(dataFromAPI) {
      $scope.menuMasters = angular.copy(dataFromAPI[0].companyMenuMasters);
      $scope.items = angular.copy(dataFromAPI[1].retailItems);

      $this.constructSelectedMenus();
      $this.constructSelectedItems();

      $this.hideLoadingModal();
    };

    this.getMenuRuleSuccess = function(dataFromAPI) {
      $scope.menuRule = angular.copy(dataFromAPI.response);

      angular.extend($scope.menuRule, {
        startDate: dateUtility.formatDateForApp($scope.menuRule.startDate),
        endDate: dateUtility.formatDateForApp($scope.menuRule.endDate)
      });
    };
    
    this.getMenuMasterAndItemsListSuccess = function(menuResponse, itemResponse) {
      $scope.menuMasters = angular.copy(menuResponse.companyMenuMasters);
      $scope.items = angular.copy(itemResponse.masterItems);
      $this.constructSelectedMenus();
      $this.constructSelectedItems();
    };
      
    this.constructSelectedMenus = function() {
      $scope.companyCabinClasses.forEach(function (cabinClass) {
        $scope.formData.selectedMenus[cabinClass.id] = lodash.filter($scope.menuRule.menus, { companyCabinClassId: cabinClass.id });
        $scope.formData.selectedMenus[cabinClass.id].forEach(function(menu) {
            menu.rawMenu = menu.menu;
            menu.menu = lodash.find($scope.menuMasters, { id: menu.menuId });
            if (!menu.menu) {
              menu.expired = true;
            }
          });
      });
    };

    this.constructSelectedItems = function () {
        $scope.companyCabinClasses.forEach(function (cabinClass) {
          $scope.formData.selectedItems[cabinClass.id] = lodash.filter($scope.menuRule.items, { companyCabinClassId: cabinClass.id });
          $scope.formData.selectedItems[cabinClass.id].forEach(function(item) {
            item.rawItem = item.item;
            item.item = lodash.find($scope.items, { itemMasterId: item.itemId });
            item.items = $scope.items;

            if (!item.item) {
              item.expired = true;
            }
          });
        });
      };
    
    this.getStationsSuccess = function(response) {
      $scope.stationList = angular.copy(response.response);
    };
  
    this.getSchedulesSuccess = function(response) {
      $scope.schedules = angular.copy(response.distinctSchedules);
    };
    
    this.getCarrierTypesSuccess = function(response) {
      $scope.carrierTypes = angular.copy(response.response);
    };

    this.getSalesCategorySuccess = function(response) {
      $scope.categories = angular.copy(response.salesCategories);
    };
    
    this.getCabinClassesSuccess = function(response) {
      $scope.companyCabinClasses = angular.copy(response.response);
    };
      
    this.getOnLoadingPayload = function() {
      var onLoadPayload = lodash.assign(angular.copy($scope.search), {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
      });
      return onLoadPayload;
    };
      
    this.initDependenciesSuccess = function(result) {
      if ($routeParams.id) {
        menuRulesFactory.getMenuRule($routeParams.id).then($this.getMenuRuleSuccess);
      }

      $this.getSchedulesSuccess(result[0]);
      $this.getStationsSuccess(result[1]);
      $this.getCarrierTypesSuccess(result[2]);
      $this.getSalesCategorySuccess(result[3]);
      $this.getCabinClassesSuccess(result[4]);
      $this.getMenuMasterAndItemsListSuccess(result[5], result[6]);
      
      $this.hideLoadingModal();
      
      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }
      
    };

    this.makeInitPromises = function() {
      companyId = menuRulesFactory.getCompanyId();
      var promises = [
        menuRulesFactory.getSchedules(companyId),
        menuRulesFactory.getCompanyGlobalStationList({ startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()) }),
        menuRulesFactory.getCarrierTypes(companyId),
        menuRulesFactory.getSalesCategoriesList(),
        menuRulesFactory.getCabinClassesList({}),
        menuRulesFactory.getMenuMasterList({}),
        menuRulesFactory.getItemsList({}, { fetchFromMaster: 'master' })
      ];

      return promises;
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();
  });
