'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PackingplanCreateCtrl
 * @description
 * # PackingplanCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PackingplanCreateCtrl', function ($scope, $q, $location, dateUtility, $routeParams, packingplanFactory, messageService, lodash, formValidationUtility) {
  
  var $this = this;

  $scope.viewName = 'Packing Plan';
  $scope.shouldDisableEndDate = false;
  $scope.menuMasterList = [];
  $scope.itemMasterList = [];
  $scope.validation = formValidationUtility;
  $scope.plan = {
    startDate: '',
    endDate: '',
    packingPlanMenu: [],
    packingPlanObject: []
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
    $scope.viewName = 'Create Packing Plan';
    $scope.viewEditItem = false;
  };

  this.viewInit = function() {
    $scope.readOnly = true;
    $scope.viewName = 'View Packing Plan';
    $scope.viewEditItem = true;
  };

  this.editInit = function() {
    $scope.readOnly = false;
    $scope.viewName = 'Edit Packing Plan';
    $scope.viewEditItem = true;
  };

  $scope.isDisabled = function() {
    return $scope.disablePastDate || $scope.readOnly;
  };

  $scope.isItemInactive = function(planObject, packingItem) {
    if ($scope.viewEditItem && planObject && packingItem && packingItem.itemMasterId) {
      return !lodash.find(planObject.itemMasterList, { id: packingItem.itemMasterId });
    }

    return false;
  };

  this.packingPlanObjectsHaveDuplicates = function () {
    var names = $scope.plan.packingPlanObject.map(function (value) {
      return value.name;
    });

    return lodash.uniq(names).length !== names.length;
  };

  this.validateForm = function() {
    $this.resetErrors();

    if (this.packingPlanObjectsHaveDuplicates()) {
      $scope.errorCustom = [{
        field: 'Packing Plan Object Name',
        value: 'Duplicate values are not allowed.'
      }];

      $scope.displayError = true;
      return false;
    }

    return $scope.packingPlanDataForm.$valid;
  };

  this.resetErrors = function() {
    $scope.formErrors = [];
    $scope.errorCustom = [];
    $scope.displayError = false;
  };

  this.showToastMessage = function(className, type, message) {
    messageService.display(className, message, type);
  };

  this.saveFormSuccess = function() {
    $this.hideLoadingModal();
    if ($routeParams.action === 'create') {
      $this.showToastMessage('success', 'Create Packing Plan', 'Success');
    } else {
      $this.showToastMessage('success', 'Edit Packing Plan', 'Success');
    }

    $location.path('packingplan-list');
  };

  this.saveFormFailure = function(dataFromAPI) {
    $this.hideLoadingModal();
    $scope.displayError = true;
    $scope.errorResponse = angular.copy(dataFromAPI);
  };

  this.formatMenus = function(menus) {
    var packingPlanMenus = [];
    angular.forEach(menus, function (menu) {
      var planMenu = {
        menuMasterId: menu.id	
      };
      if ($routeParams.id && menu.pKey) {
        planMenu.id = menu.pKey;
        planMenu.packingPlanId = menu.packingPlanId;
        planMenu.menuMasterId = menu.menuMasterId;
      }

      packingPlanMenus.push(planMenu);
    });

    return packingPlanMenus;
  };

  this.formatPackingPlanObjectItems = function(planObjectItems) {
    var packingPlanObjectItems = [];
    angular.forEach(planObjectItems, function (item) {
      if (item.itemMasterId) {
        var planObjItem = {
          itemMasterId: item.itemMasterId,
          minQty: item.minQty,
          maxQty: item.maxQty
        };
        if ($routeParams.id) {
          planObjItem.id = item.id; 
          planObjItem.packingPlanObjectId = item.packingPlanObjectId;
        }

        packingPlanObjectItems.push(planObjItem);
      }  
    });

    return packingPlanObjectItems;
  };

  this.formatPackingPlanObjects = function(planObjects) {
    var packingPlanObjects = [];
    angular.forEach(planObjects, function (planObject) {
      var planObj = {
        name: planObject.name,
        description: planObject.description,
        length: planObject.length,
        breadth: planObject.breadth,
        height: planObject.height,
        dimensionType: planObject.dimensionType,
        object: planObject.position,
        galley: planObject.galley,
        notes: planObject.notes,
        startDate: dateUtility.formatDateForAPI(planObject.startDate),
        endDate: dateUtility.formatDateForAPI(planObject.endDate),
        packingPlanObjectItem: planObject.packingPlanObjectItem ? $this.formatPackingPlanObjectItems(planObject.packingPlanObjectItem) : []
      };
      if ($routeParams.id) {
        planObj.id = planObject.id; 
        planObj.packingPlanId = planObject.packingPlanId;
      }

      packingPlanObjects.push(planObj);
    });

    return packingPlanObjects;
  };

  this.createPackingPlan = function() {
    $this.showLoadingModal('Creating Packing Plan');
    var payload = {
      companyId: packingplanFactory.getCompanyId(),
      name: $scope.plan.name,
      version: $scope.plan.version,
      startDate: dateUtility.formatDateForAPI($scope.plan.startDate),
      endDate: dateUtility.formatDateForAPI($scope.plan.endDate),
      packingPlanMenu: $scope.plan.packingPlanMenu ? $this.formatMenus($scope.plan.packingPlanMenu) : [],  
      packingPlanObject: $scope.plan.packingPlanObject ? $this.formatPackingPlanObjects($scope.plan.packingPlanObject) : []
    };

    packingplanFactory.createPackingPlan(payload).then(
      $this.saveFormSuccess, $this.saveFormFailure
    );
  };

  this.editPackingPlan = function() {
    $this.showLoadingModal('Saving Packing Plan');
    var payload = {
      id: $routeParams.id,
      name: $scope.plan.name,
      companyId: packingplanFactory.getCompanyId(),
      version: $scope.plan.version,
      startDate: dateUtility.formatDateForAPI($scope.plan.startDate),
      endDate: dateUtility.formatDateForAPI($scope.plan.endDate),
      packingPlanMenu: $scope.plan.packingPlanMenu[0] ? $this.formatMenus($scope.plan.packingPlanMenu) : [],  
      packingPlanObject: $scope.plan.packingPlanObject ? $this.formatPackingPlanObjects($scope.plan.packingPlanObject) : []
    };

    packingplanFactory.updatePackingPlan(payload).then(
      $this.saveFormSuccess, $this.saveFormFailure
    );
  };

  $scope.formSave = function() {
    if ($this.validateForm()) {
      var saveFunctionName = ($routeParams.action + 'PackingPlan');
      if ($this[saveFunctionName]) {
        $this[saveFunctionName]();
      }
    } else {
      $scope.displayError = true;
    }
  };

  $scope.addObjectItemRestrictions = function(_array) {
    _array.push({
    });
  };

  $scope.removeObjectItemRestrictions = function(_array, key) {
    _array.splice(key, 1);
  };

  $scope.addPackingPlanObject = function() {
    $scope.plan.packingPlanObject.push({
      startDate: null,
      endDate: null,
      packingPlanObjectItem: []
    });
  };

  $scope.removePackingPlanObject = function(key) {
    $scope.plan.packingPlanObject.splice(key, 1);
  };

  this.getMenuMasterList = function(startDate, endDate) {
    var payload = {
      startDate: dateUtility.formatDateForAPI(startDate),
      endDate: dateUtility.formatDateForAPI(endDate)
    };
 
    packingplanFactory.getMenuMasterList(payload).then(function(data) {
      $scope.menuMasterList = angular.copy(data.companyMenuMasters);
    });
  };

  this.getItemMasterFromMenu = function(packingPlanObject, menus, viewedit) {
    var totalItems = [];
    angular.forEach(menus, function (menu) {
      var payload = {
        menuId: menu.id,
        startDate: dateUtility.formatDateForAPI(packingPlanObject.startDate),
        endDate: dateUtility.formatDateForAPI(packingPlanObject.endDate)
      };
      if (viewedit) {
        payload.menuId = menu.menuMasterId;
      }

      packingplanFactory.getMenuById(payload).then(function(data) {
        angular.forEach(data.menus, function (menu) {
          angular.forEach(menu.menuItems, function (item) {
            var itemPayload = {};
            itemPayload.id = item.itemId;
            itemPayload.itemName = item.itemName;
            itemPayload.itemQty = item.itemQty;
            totalItems.push(itemPayload);
          });
        });
      });
    });

    packingPlanObject.itemMasterList =  totalItems;
  };

  this.isPlanObjectItemDatesSet = function (packingPlanObject) {
    return packingPlanObject !== null && packingPlanObject.startDate !== null && packingPlanObject.endDate !== null;
  };

  this.isPlanObjectItemDatesChanged = function (packingPlanObject) {
    var cachedStartDate = (packingPlanObject.planObjectItemsCache) ? packingPlanObject.planObjectItemsCache.startDate : null;
    var cachedEndDate = (packingPlanObject.planObjectItemsCache) ? packingPlanObject.planObjectItemsCache.endDate : null;

    return $this.isPlanObjectItemDatesSet(packingPlanObject) && (packingPlanObject.startDate !== cachedStartDate || packingPlanObject.endDate !== cachedEndDate);
  };

  $scope.refreshPlanObjectItems = function (packingPlanObject, forceRefresh) {
    if (($scope.isCreate || !$scope.isDisabled()) && $this.isPlanObjectItemDatesSet(packingPlanObject) && (forceRefresh || $this.isPlanObjectItemDatesChanged(packingPlanObject))) {
      packingPlanObject.planObjectItemsCache = {
        startDate: packingPlanObject.startDate,
        endDate: packingPlanObject.endDate
      };

      $this.getItemMasterFromMenu(packingPlanObject, $scope.plan.packingPlanMenu, false);
    }
  };

  $scope.filteredPackingPlanObjectItems = function (planObject, selectedItemMasterId) {
    return lodash.filter(planObject.itemMasterList, function (item) {
      return selectedItemMasterId === item.id || !lodash.find(planObject.packingPlanObjectItem, { itemMasterId: item.id });
    });
  };

  $scope.omitSelectedMenus = function (menu) {
    var selectedMenu = $scope.plan.packingPlanMenu.filter(function (existingMenu) {
      return (existingMenu.id === menu.id);
    });

    return (selectedMenu.length === 0);
  };

  $scope.$watch('plan.packingPlanMenu', function () {
    if ($scope.plan && $scope.plan.packingPlanMenu && ($scope.isCreate || !$scope.isDisabled())) {
      $scope.plan.packingPlanObject.forEach(function (value) {
        $scope.refreshPlanObjectItems(value, true);
      });
    }
  });

  $scope.$watchGroup(['plan.startDate', 'plan.endDate'], function () {
    if ($scope.plan && $scope.plan.startDate && $scope.plan.endDate) {
      $this.getMenuMasterList($scope.plan.startDate, $scope.plan.endDate);
    }
  });

  this.formatViewMenus = function(menus) {
    var packingPlanMenus = [];
    angular.forEach(menus, function (menu) {
      var planMenu = {
        id: menu.menuMasterId,
        pKey: menu.id,
        packingPlanId: menu.packingPlanId, 
        menuMasterId: menu.menuMasterId,
        menuName: menu.menuMaster.menuName
      };
      packingPlanMenus.push(planMenu);
    });

    return packingPlanMenus;
  };

  this.formatViewPackingPlanObjectItems = function(planObjectItems) {
    var packingPlanObjectItems = [];
    angular.forEach(planObjectItems, function (item) {
      var planObjItem = {
        id: item.id,
        itemMasterId: item.itemMasterId,
        itemName: item.itemMaster.itemName,
        minQty: item.minQty,
        packingPlanObjectId: item.packingPlanObjectId, 
        maxQty: item.maxQty
      };
      packingPlanObjectItems.push(planObjItem);
    });

    return packingPlanObjectItems;
  };

  this.formatViewPackingPlanObjects = function(planObjects) {
    var packingPlanObjects = [];
    angular.forEach(planObjects, function (planObject) {
      var planObj = {
        id: planObject.id,
        name: planObject.name,
        packingPlanId: planObject.packingPlanId,
        description: planObject.description,
        length: planObject.length,
        breadth: planObject.breadth,
        height: planObject.height,
        dimensionType: planObject.dimensionType,
        position: planObject.object,
        galley: planObject.galley,
        notes: planObject.notes,
        startDate: dateUtility.formatDateForApp(planObject.startDate),
        endDate: dateUtility.formatDateForApp(planObject.endDate),
        packingPlanObjectItem: planObject.packingPlanObjectItem ? $this.formatViewPackingPlanObjectItems(planObject.packingPlanObjectItem) : []
      };
      packingPlanObjects.push(planObj);
    });

    return packingPlanObjects;
  };

  this.packingPlanSuccess = function(response) {
    $scope.viewStartDate = dateUtility.formatDateForApp(response.startDate);
    $scope.viewEndDate = dateUtility.formatDateForApp(response.endDate);
    $scope.disablePastDate = dateUtility.isTodayOrEarlierDatePicker($scope.viewStartDate);
    if (!$scope.isDisabled()) {
      $this.getMenuMasterList($scope.viewStartDate, $scope.viewEndDate);
    }

    $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewEndDate);
    $scope.plan = {
      id: response.id,
      name: response.name,
      version: response.version,
      companyId: response.companyId,
      startDate: $scope.viewStartDate,
      endDate: $scope.viewEndDate,
      packingPlanMenu: response.packingPlanMenu[0] ? $this.formatViewMenus(response.packingPlanMenu) : [],  
      packingPlanObject: response.packingPlanObject[0] ? $this.formatViewPackingPlanObjects(response.packingPlanObject) : []
    };

  };

  this.initDependenciesSuccess = function(responseCollection) {
    $scope.dimensionUnits = angular.copy(responseCollection[0].units);
    if ($routeParams.id) {
      packingplanFactory.getPackingPlanById($routeParams.id).then($this.packingPlanSuccess);
    }

    $this.hideLoadingModal();

    var initFunctionName = ($routeParams.action + 'Init');
    if ($this[initFunctionName]) {
      $this[initFunctionName]();
    }

  };

  this.makeInitPromises = function() {
    var promises = [
      packingplanFactory.getDimensionList()
    ];

    return promises;
  };

  this.init = function() {
    $this.showLoadingModal('Loading Data');
    $scope.minDate = dateUtility.nowFormattedDatePicker();
    $scope.addPackingPlanObject();
    var initPromises = $this.makeInitPromises();
    $q.all(initPromises).then($this.initDependenciesSuccess);
  };

  $this.init();

});
