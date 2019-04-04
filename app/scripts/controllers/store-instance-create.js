'use strict';
/*jshint maxcomplexity:7 */
/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceCreateCtrl
 * @description
 * # StoreInstanceCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstanceCreateCtrl',
  function ($scope, $routeParams, $q, storeInstanceFactory, sealTypesService, storeInstanceAssignSealsFactory,
            messageService, dateUtility, globalMenuService, storeInstanceWizardConfig, $location, schedulesService,
            menuCatererStationsService, lodash, $route, $filter, $localStorage) {

    $scope.cateringStationList = [];
    $scope.dispatchStationList = [];
    $scope.menuMasterList = [];
    $scope.filteredMenuList = [];
    $scope.carrierNumbers = [];
    $scope.storesList = [];
    $scope.scheduleNumbers = [];
    $scope.routesList = [];
    $scope.routesListCopy = [];
    $scope.formData = {
      menus: []
    };
    $scope.scheduleDateOption = 0;
    $scope.redispatchOrReplenishNew = false;
    $scope.undispatch = false;
    $scope.storeNumberValid = true;
    var $this = this;

    this.isActionState = function (action) {
      return $routeParams.action === action;
    };

    this.isDispatchOrRedispatch = function () {
      return (this.isActionState('dispatch') || this.isActionState('redispatch'));
    };

    this.isEndInstanceOrRedispatch = function () {
      return (this.isActionState('end-instance') || this.isActionState('redispatch'));
    };

    this.isEndInstanceOrReplenish = function () {
      return (this.isActionState('end-instance') || this.isActionState('replenish'));
    };

    this.isRedispatchOrReplenish = function () {
      return (this.isActionState('replenish') || this.isActionState('redispatch'));
    };

    this.isEditingDispatch = function () {
      return this.isActionState('dispatch') && angular.isDefined($routeParams.storeId);
    };

    this.isEditingRedispatch = function () {
      return this.isActionState('redispatch') && angular.isDefined($routeParams.storeId);
    };

    this.setStoreInstancesOnFloor = function (dataFromAPI) {
      $scope.storeInstancesOnFloor = angular.copy(dataFromAPI.response);
    };

    this.getInstancesOnFloor = function () {
      var query = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
        statusId: 10
      };
      return storeInstanceFactory.getStoreInstancesList(query).then($this.setStoreInstancesOnFloor);
    };

    this.setReplenishInstance = function (storeDetailsJSON) {
      if (storeDetailsJSON.replenishStoreInstanceId) {
        $scope.formData.replenishStoreInstanceId = storeDetailsJSON.replenishStoreInstanceId;
        $scope.formData.cateringStationId = storeDetailsJSON.cateringStationId.toString();
        $scope.formData.menus = storeDetailsJSON.parentStoreInstance.menus;
        return;
      }
    };

    $scope.filterStoreNumberList = function () {
      $scope.storesListSearch = angular.copy($scope.storesListFilterText);
    };

    $scope.setStoreNumber = function (storeNumber) {
      $scope.formData.storeNumber = storeNumber.storeNumber;
      angular.element('#store-numbers').modal('hide');
    };

    this.handleExistingStoreNumberValidation = function (storeNumber) {
      $scope.showStoreNumberAlert = !storeNumber.readyToUse;
      $scope.storeNumberWarning = storeNumber.readyToUse ? '' : 'Store Number ' + $scope.formData.storeNumber + ' is already in use';
      $scope.formData.storeNumber = storeNumber.readyToUse ? $scope.formData.storeNumber : '';
    };

    this.handleInvalidStoreNumber = function () {
      $scope.showStoreNumberAlert = true;
      $scope.storeNumberWarning = 'Store Number ' + $scope.formData.storeNumber + ' does not exist';
      $scope.formData.storeNumber = '';
    };

    $scope.validateStoreNumber = function () {
      $scope.showStoreNumberAlert = false;
      $scope.storeNumberWarning = '';

      var shouldSkipValidation = !$scope.formData.storeNumber || (angular.isDefined($scope.oldStoreNumber) && $scope.oldStoreNumber === $scope.formData.storeNumber);
      if (shouldSkipValidation) {
        return;
      }

      var storeNumberMatch = lodash.findWhere($scope.storesList, { storeNumber: $scope.formData.storeNumber });
      if (!storeNumberMatch) {
        $this.handleInvalidStoreNumber();
        return;
      }

      $this.handleExistingStoreNumberValidation(storeNumberMatch);
    };

    $scope.showStoreNumbersModal = function () {
      angular.element('#store-numbers').modal('show');
    };

    this.formatCurrentStoreForStoreList = function (store) {
      var currentStore = {
        companyId: store.companyId,
        endDate: null,
        id: $scope.storeDetails.storeId,
        readyToUse: true,
        startDate: $scope.storeDetails.scheduleDate,
        storeNumber: $scope.storeDetails.storeNumber
      };
      return currentStore;
    };

    this.addCurrentStoreToStoreList = function () {
      if ($scope.storesList && $scope.storeDetails) {
        var currentStoreArray = [];
        var filteredStore;
        angular.forEach($scope.storesList, function (store) {
          if (store.id !== $scope.storeDetails.storeId) {
            var currentStore = $this.formatCurrentStoreForStoreList(store);
            currentStoreArray.push(currentStore);
            filteredStore = $filter('unique')(currentStoreArray, 'storeNumber');
          }
        });

        if (angular.isDefined(filteredStore)) {
          $scope.storesList.push(filteredStore[0]);
        }
      }
    };

    this.setStoreDetails = function (storeDetailsJSON) {
      $scope.storeDetails = angular.copy(storeDetailsJSON);
      if ($this.isActionState('replenish')) {
        $this.setReplenishInstance(storeDetailsJSON);
      }

      if ($this.isEditingDispatch()) {
        $this.addCurrentStoreToStoreList();
      }
    };

    this.doesStoreIdFromStepTwoExist = function () {
      var ls = $localStorage.stepTwoFromStepOne;
      if (angular.isDefined(ls) && angular.isDefined(ls.storeId)) {
        return ls.storeId;
      }

      return null;
    };

    this.setPrevStoreDetails = function (storeDetailsJSON) {
      $scope.prevStoreDetails = storeDetailsJSON;
      var prevStatus = $scope.prevStoreDetails.currentStatus;
      var inboundOrAfterStatus = lodash.findWhere($scope.prevStoreDetails.statusList, { statusName: 'Inbounded' });
      var localStoragePrevStore = $this.doesStoreIdFromStepTwoExist();
      $scope.stepOneFromStepTwo = (localStoragePrevStore !== null) ? true : (prevStatus.name) < parseInt(inboundOrAfterStatus.name);
    };

    this.getStoreDetails = function () {
      return storeInstanceFactory.getStoreDetails($routeParams.storeId).then($this.setStoreDetails);
    };

    this.getPrevStoreDetails = function () {
      return storeInstanceFactory.getStoreDetails($scope.prevStoreInstanceId).then($this.setPrevStoreDetails);
    };

    this.getFormattedDatesPayload = function () {
      return {
        startDate: dateUtility.formatDateForAPI($scope.formData.scheduleDate !== '' ? $scope.formData.scheduleDate : dateUtility.nowFormattedDatePicker()),
        endDate: dateUtility.formatDateForAPI($scope.formData.scheduleDate !== '' ? $scope.formData.scheduleDate : dateUtility.nowFormattedDatePicker())
      };
    };

    this.getFormattedOperationalDaysPayload = function () {
      // Monday -> Sunday = 1 -> 7
      return dateUtility.getOperationalDay($scope.formData.scheduleDate !== '' ? $scope.formData.scheduleDate : dateUtility.nowFormattedDatePicker()) || 7;
    };

    this.setCatererStationList = function (dataFromAPI) {
      $scope.cateringStationList = angular.copy(dataFromAPI.response);
      if ($scope.cateringStationList.length === 1) {
        $scope.formData.cateringStationId = $scope.cateringStationList[0].id;
      }
    };

    this.getCatererStationList = function () {
      var query = this.getFormattedDatesPayload();
      return storeInstanceFactory.getCatererStationList(query).then(this.setCatererStationList);
    };

    this.setDispatchStationList = function (dataFromAPI) {
      $scope.dispatchStationList.push(dataFromAPI);
    };

    this.getDispatchStationList = function () {
      return storeInstanceFactory.getStation($scope.formData.dispatchedCateringStationId).then(this.setDispatchStationList);
    };

    this.setMenuCatererList = function (dataFromAPI) {
      $scope.menuCatererList = angular.copy(dataFromAPI.companyMenuCatererStations);
    };

    this.removeInvalidMenus = function () {
      angular.forEach($scope.formData.menus, function (menu) {
        var validMenu = $scope.filteredMenuList.filter(function (filteredMenu) {
          return filteredMenu.id === menu.id;
        });

        if (validMenu.length === 0) {
          var index = $scope.formData.menus.indexOf(menu);
          $scope.formData.menus.splice(index, 1);
        }
      });
    };

    this.filterMenusList = function () {
      $scope.filteredMenuList = [];
      var output = [];
      angular.forEach($scope.menuCatererList, function (menuCaterer) {
        var filteredMenu = lodash.findWhere($scope.menuMasterList, {
          id: menuCaterer.menuId
        });
        if (filteredMenu) {
          output.push(filteredMenu);
        }
      });

      var keys = [];
      angular.forEach(output, function(fMenu) {
        var key = fMenu.menuId;
        var indx = keys.indexOf(key);
        if (indx === -1) {
          keys.push(key);
          $scope.filteredMenuList.push(fMenu);
        }
      });
    };

    this.generateNewMenu = function (menu) {
      var newMenu = {
        id: menu.menuMasterId
      };
      var existingMenu = $scope.filteredMenuList.filter(function (menuMaster) {
        return menuMaster.id === menu.menuMasterId;
      })[0];

      if (angular.isDefined(existingMenu)) {
        newMenu.menuCode = existingMenu.menuCode;
        newMenu.menuName = existingMenu.menuName;
      }

      if (angular.isDefined(menu.id)) {
        newMenu.recordId = menu.id;
      }

      return newMenu;
    };

    this.setStoreInstanceMenus = function () {
      var newMenus = [];
      angular.forEach($scope.formData.menus, function (menu) {
        var newMenu = $this.generateNewMenu(menu);

        var filteredMenu = lodash.findWhere($scope.filteredMenuList, {
          id: newMenu.id
        });

        if (filteredMenu) {
          newMenus.push(newMenu);
        }
      });

      $scope.formData.menus = newMenus;
    };

    this.createGetMenuCatererListPayload = function () {
      var payload = angular.extend({}, $this.getFormattedDatesPayload(), {
        catererStationId: $scope.formData.cateringStationId
      });
      if ($routeParams.action === 'replenish') {
        payload.catererStationId = $scope.formData.dispatchedCateringStationId;
      }

      return payload;
    };

    this.getMenuCatererList = function () {
      var payload = $this.createGetMenuCatererListPayload();

      return menuCatererStationsService.getRelationshipList(payload).then($this.setMenuCatererList);
    };

    this.setMenuMasterList = function (dataFromAPI) {
      $scope.menuMasterList = dataFromAPI.companyMenuMasters;
    };

    this.getMenuMasterList = function () {
      var query = this.getFormattedDatesPayload();
      return storeInstanceFactory.getMenuMasterList(query).then($this.setMenuMasterList);
    };

    this.setCarrierNumbers = function (dataFromAPI) {
      $scope.carrierNumbers = angular.copy(dataFromAPI.response);
    };

    this.getCarrierNumbers = function () {
      var query = this.getFormattedDatesPayload();
      var companyId = globalMenuService.getCompanyData().companyId;
      return storeInstanceFactory.getAllCarrierNumbers(companyId, query).then($this.setCarrierNumbers);
    };

    this.determineReadyToUse = function () {
      return !this.isActionState('replenish');
    };

    this.formatStoresList = function () {
      angular.forEach($scope.validStoresList, function (store) {
        store.startDate = dateUtility.formatDateForApp(store.startDate);
        store.endDate = dateUtility.formatDateForApp(store.endDate);
      });
    };

    this.setStoresList = function (dataFromAPI) {
      var storesListFromAPI = angular.copy(dataFromAPI.response);
      var shouldFilterReadyToUse = $this.determineReadyToUse();

      $scope.storesList = storesListFromAPI;
      $scope.validStoresList = shouldFilterReadyToUse ? lodash.filter(storesListFromAPI, { readyToUse: true }) : storesListFromAPI;

      var storeIdMatch = lodash.findWhere(storesListFromAPI, { id: parseInt($scope.oldStoreNumberId) });
      var storeIdMatchInStoresList = lodash.findWhere($scope.storesList, { id: parseInt($scope.oldStoreNumberId) });
      if ($scope.oldStoreNumberId && storeIdMatch && !storeIdMatchInStoresList) {
        $scope.validStoresList.push(storeIdMatch);
      }

      $this.formatStoresList();

      $scope.storeNumberValid = true;
      if ($this.isActionState('replenish')) {
        $this.validateReplenishStoreNumber();
      }

    };

    this.validateReplenishStoreNumber = function () {
      $scope.storeNumberValid = true;
      var scheduleDate = dateUtility.isDateValidForApp($scope.formData.scheduleDate) ? $scope.formData.scheduleDate : dateUtility.formatDateForApp($scope.formData.scheduleDate);      
      var loadStore = lodash.findWhere($scope.storesList, { storeNumber: $scope.formData.storeNumber });
      $scope.displayError = false;
      if (angular.isDefined(loadStore) && angular.isDefined(scheduleDate)) {
        var startDate = dateUtility.isDateValidForApp(loadStore.startDate) ? loadStore.startDate : dateUtility.formatDateForApp(loadStore.startDate);
        var endDate = dateUtility.isDateValidForApp(loadStore.endDate) ? loadStore.endDate : dateUtility.formatDateForApp(loadStore.endDate);
        var isAfter = dateUtility.isAfterOrEqual(scheduleDate, startDate);
        var isBefore = dateUtility.isBeforeOrEqual(scheduleDate, endDate);
        if (!isAfter || !isBefore) {
          $scope.displayError = true;
          $scope.storeNumberValid = false;
          $scope.errorCustom = [{
            field: 'Store Number',
            value: 'Not valid for selected schedule date'
          }];
        }
      }
    };

    this.getStoresList = function () {
      var query = $this.isActionState('dispatch') ? this.getFormattedDatesPayload() : {};
      if (this.isActionState('replenish')) {
        query.readyToUse = false;
      }

      return storeInstanceFactory.getStoresList(query).then($this.setStoresList);
    };

    this.getItemsSuccessHandler = function (dataFromAPI) {
      var menuItems = angular.copy(dataFromAPI.response);
      $scope.itemsToDelete = [];
      angular.forEach(menuItems, function (item) {
        $scope.itemsToDelete.push(item);
      });
    };

    this.getPrevStoreItemsSuccessHandler = function (dataFromAPI) {
      var menuItems = angular.copy(dataFromAPI.response);
      $scope.prevStoreItemsToDelete = [];
      angular.forEach(menuItems, function (item) {
        $scope.prevStoreItemsToDelete.push(item);
      });
    };

    this.getStoreInstanceItems = function (storeInstanceId) {
      storeInstanceFactory.getStoreInstanceItemList(storeInstanceId).then($this.getItemsSuccessHandler);
    };

    this.getPrevStoreInstanceItems = function (storeInstanceId) {
      storeInstanceFactory.getStoreInstanceItemList(storeInstanceId).then($this.getPrevStoreItemsSuccessHandler);
    };

    this.formatMenus = function (menus) {
      var newMenus = [];
      angular.forEach(menus, function (menu) {
        var newMenuPayload = { menuMasterId: menu.id };
        if (menu.recordId) {
          newMenuPayload.id = menu.recordId;
        }

        newMenus.push(newMenuPayload);
      });

      return newMenus;
    };

    this.formatEndInstancePayload = function (payload) {
      payload.menus = this.formatMenus(payload.menus);
      payload.inboundStationId = angular.copy(payload.cateringStationId);
      payload.cateringStationId = angular.copy(payload.dispatchedCateringStationId);
      delete payload.dispatchedCateringStationId;
    };

    this.formatDispatchPayload = function (payload) {
      payload.menus = this.formatMenus(payload.menus);
      if ($routeParams.storeId) {
        delete payload.dispatchedCateringStationId;
      }
    };

    this.formatRedispatchPayload = function (payload) {
      payload.prevStoreInstanceId = $scope.stepOneFromStepTwo ? $scope.prevStoreInstanceId : $routeParams.storeId;
      payload.menus = this.formatMenus(payload.menus);
      delete payload.dispatchedCateringStationId;
      if ($scope.existingSeals && $scope.userConfirmedDataLoss) {
        payload.note = '';
        payload.tampered = false;
      }
    };

    this.formatInitialRedispatchPayload = function (payload) {

      if ($scope.stepOneFromStepTwo && angular.isDefined($scope.storeDetails.prevStoreInstanceId)) {
        payload = {
          scheduleDate: dateUtility.formatDateForAPI($scope.prevStoreDetails.scheduleDate),
          menus: $this.formatMenus($scope.prevStoreDetails.menuList),
          inboundStationId: parseInt($scope.formData.cateringStationId),
          cateringStationId: parseInt($scope.prevStoreDetails.cateringStationId),
          scheduleNumber: $scope.prevStoreDetails.scheduleNumber,
          scheduleId: $scope.prevStoreDetails.scheduleId,
          storeId: parseInt($scope.prevStoreDetails.storeId)
        };

        if ($scope.existingSeals && $scope.userConfirmedDataLoss) {
          payload.note = '';
          payload.tampered = false;
        }
      }

      if (angular.isUndefined($scope.storeDetails.prevStoreInstanceId) || !$scope.stepOneFromStepTwo) {
        payload = {
          scheduleDate: dateUtility.formatDateForAPI($scope.storeDetails.scheduleDate),
          menus: $this.formatMenus(payload.menus),
          inboundStationId: parseInt($scope.formData.cateringStationId),
          cateringStationId: parseInt($scope.storeDetails.cateringStationId),
          scheduleNumber: $scope.storeDetails.scheduleNumber,
          scheduleId: $scope.storeDetails.scheduleId,
          storeId: parseInt($scope.storeDetails.storeId)
        };
      }

      return payload;
    };

    this.formatReplenishPayload = function (payload) {
      if (!$scope.formData.replenishStoreInstanceId) {
        payload.replenishStoreInstanceId = $routeParams.storeId;
      }

      if ($localStorage.replenishUpdateStep) {
        payload.replenishStoreInstanceId = $routeParams.replenishstoreId;
      }

      delete payload.menus;
      delete payload.dispatchedCateringStationId;
    };

    this.setWizardSteps = function () {
      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
      var currentStepIndex = lodash.findIndex($scope.wizardSteps, {
        controllerName: 'Create'
      });
      $this.nextStep = angular.copy($scope.wizardSteps[currentStepIndex + 1]);
    };

    this.setPrevInstanceWizardSteps = function () {
      $scope.prevInstanceWizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
      var currentStepIndex = lodash.findIndex($scope.prevInstanceWizardSteps, {
        controllerName: 'Create'
      });
      $this.prevInstanceNextStep = angular.copy($scope.prevInstanceWizardSteps[currentStepIndex]);
    };

    this.actionSwitch = function (action) {
      return action ? action : $routeParams.action;
    };

    this.formatPayload = function (action) {
      var payload = angular.copy($scope.formData);
      payload.scheduleDate = dateUtility.formatDateForAPI(payload.scheduleDate);
      payload.scheduleId = payload.scheduleId.id;
      payload.scheduleNumber = payload.scheduleNumber.scheduleNumber;

      var actionSwitch = this.actionSwitch(action);
      switch (actionSwitch) {
        case 'replenish':
          $this.formatReplenishPayload(payload);
          break;
        case 'redispatch':
          payload.storeId = lodash.findWhere($scope.storesList, { storeNumber: payload.storeNumber }).id;
          $this.formatRedispatchPayload(payload);
          break;
        case 'redispatch-initial':
          payload.storeId = lodash.findWhere($scope.storesList, { storeNumber: payload.storeNumber }).id;
          return $this.formatInitialRedispatchPayload(payload);
        case 'end-instance':
          payload.storeId = lodash.findWhere($scope.storesList, { storeNumber: payload.storeNumber }).id;
          $this.formatEndInstancePayload(payload);
          break;
        default:
          var loadStore = lodash.findWhere($scope.storesList, { storeNumber: payload.storeNumber });
          if (angular.isDefined(loadStore)) {
            payload.storeId = lodash.findWhere($scope.storesList, { storeNumber: payload.storeNumber }).id;
          } else {
            payload.storeId = null;
            $scope.errorCustom = [{
              field: 'Store Number',
              value: 'Not valid for selected schedule date'
            }];
          }

          $this.formatDispatchPayload(payload);
          break;
      }
      return payload;
    };

    this.determineMinDate = function () {
      var diff = 0;
      if ($scope.editingItem && !dateUtility.isTomorrowOrLaterDatePicker($scope.formData.startDate)) {
        diff = dateUtility.diff(
          dateUtility.nowFormattedDatePicker(),
          $scope.formData.startDate
        );
      }

      var dateString = diff.toString() + 'd';
      if (diff >= 0) {
        dateString = '+' + dateString;
      }

      return dateString;
    };

    this.setCateringStationId = function (apiData) {
      if (apiData && apiData.cateringStationId) {
        return apiData.cateringStationId.toString();
      }

      return null;
    };

    this.setScheduleDate = function (apiData) {
      if (apiData && apiData.scheduleDate) {
        return dateUtility.formatDateForApp(apiData.scheduleDate);
      }

      return null;
    };

    this.setScheduleId = function (apiData) {
      if (apiData && apiData.scheduleId) {
        return apiData.scheduleId.toString();
      }

      return null;
    };

    this.setScheduleNumber = function (apiData) {
      var scheduleNumber = {};
      if (apiData && apiData.scheduleNumber) {
        scheduleNumber = {
          scheduleNumber: apiData.scheduleNumber,
          departure: apiData.departureStationCode,
          arrival: apiData.arrivalStationCode
        };
        return scheduleNumber;
      }

      return undefined;
    };

    this.setStoreNumber = function (apiData) {
      if (apiData && apiData.storeNumber) {
        $scope.oldStoreNumber = apiData.storeNumber.toString();
        return apiData.storeNumber.toString();
      }

      return null;
    };

    this.setStoreId = function (apiData) {
      if (apiData && apiData.storeId) {
        $scope.oldStoreNumberId = apiData.storeId.toString();
        return apiData.storeId.toString();
      }

      return null;
    };

    this.setCarrierId = function (apiData) {
      if (apiData && apiData.carrierId) {
        return apiData.carrierId.toString();
      }

      return null;
    };

    this.formatMenuList = function (menu) {
      var currentMenu = {
        id: menu.menuMaster.menuId,
        menuName: menu.menuMaster.menuName,
        menuCode: menu.menuMaster.menuCode,
        menuMasterId: menu.menuMasterId,
      };
      return currentMenu;
    };

    this.setMenus = function (apiData) {
      if (apiData && apiData.menus) {
        var newMenus = [];
        angular.forEach(apiData.menus, function (menu) {
          var newMenuObj = $this.formatMenuList(menu);
          newMenus.push(newMenuObj);
        });

        return newMenus;
      }

      return null;
    };

    this.setPrevStoreInstanceId = function (apiData) {
      if (apiData && apiData.prevStoreInstanceId) {
        return apiData.prevStoreInstanceId;
      }

      return null;
    };

    this.setStoreInstanceConditionals = function (data) {
      $scope.prevStoreInstanceId = $this.setPrevStoreInstanceId(data);
      var stepTwoStoreId = $this.doesStoreIdFromStepTwoExist();
      if ($this.isRedispatchOrReplenish()) {
        if ($this.isActionState('redispatch') && !(data && data.id === parseInt(stepTwoStoreId))) {
          $scope.redispatchOrReplenishNew = true;
          delete $scope.formData.scheduleNumber;
          delete $scope.formData.scheduleId;
          delete $scope.formData.carrierId;
        } else if ($this.isActionState('replenish') && !(data && data.replenishStoreInstanceId)) {
          $scope.redispatchOrReplenishNew = true;
        } else {
          $scope.formData.scheduleDate = $this.setScheduleDate(data);
        }
      }

    };

    this.setStoreInstance = function (apiData) {
      if (angular.isObject(apiData)) {
        var data = angular.copy(apiData);
        $scope.formData = {
          dispatchedCateringStationId: $this.setCateringStationId(data),
          scheduleDate: $this.setScheduleDate(data),
          scheduleNumber: $this.setScheduleNumber(data),
          scheduleId: $this.setScheduleId(data),
          storeId: $this.setStoreId(data),
          carrierId: $this.setCarrierId(data),
          menus: $this.setMenus(data),
          cateringStationId: $this.isEditingRedispatch() ? null : $this.setCateringStationId(data),
          storeNumber: $this.setStoreNumber(data)
        };
        $this.setStoreInstanceConditionals(data);
        $this.getDispatchStationList();

      }

      $this.getActiveCompanyPreferences();
    };

    this.getStoreInstance = function () {
      storeInstanceFactory.getStoreInstance($routeParams.storeId).then($this.setStoreInstance);
    };

    this.setSealTypes = function (sealTypesJSON) {
      $scope.sealTypes = sealTypesJSON;
    };

    this.getSealTypes = function () {
      return sealTypesService.getSealTypes().then($this.setSealTypes);
    };

    this.setStoreInstanceSeals = function (dataFromAPI) {
      $scope.currentStoreExistingSeals = angular.copy(dataFromAPI.response);
    };

    this.setPrevStoreInstanceSeals = function (dataFromAPI) {
      $scope.prevStoreExistingSeals = angular.copy(dataFromAPI.response);
    };

    this.getStoreInstanceSeals = function (storeInstanceId) {
      if (storeInstanceId === $routeParams.storeId) {
        return storeInstanceAssignSealsFactory.getStoreInstanceSeals(storeInstanceId).then($this.setStoreInstanceSeals);
      }

      if (storeInstanceId === $scope.prevStoreInstanceId) {
        return storeInstanceAssignSealsFactory.getStoreInstanceSeals(storeInstanceId).then($this.setPrevStoreInstanceSeals);
      }
    };

    this.setExistingSeals = function () {
      var existingSeals = [];
      if ($scope.currentStoreExistingSeals) {
        angular.forEach($scope.currentStoreExistingSeals, function (seal) {
          existingSeals.push(seal);
        });
      }

      if ($scope.prevStoreExistingSeals) {
        angular.forEach($scope.prevStoreExistingSeals, function (seal) {
          existingSeals.push(seal);
        });
      }

      $scope.existingSeals = existingSeals;
    };

    this.formatExistingSeals = function (sealsList) {
      var formattedSeals = [];
      for (var key in sealsList) {
        var seal = sealsList[key];
        formattedSeals.push(seal.sealNumbers[0]);
      }

      return formattedSeals;
    };

    this.getExistingSeals = function (typeId) {
      if (!$scope.existingSeals) {
        return [];
      }

      var sealsList = $scope.existingSeals.filter(function (sealType) {
        return sealType.type === typeId;
      });

      return this.formatExistingSeals(sealsList);
    };

    this.generateSealTypeObject = function (sealType) {
      return {
        id: sealType.id,
        name: sealType.name,
        seals: {
          numbers: $this.getExistingSeals(sealType.id)
        }
      };
    };

    this.generateSealTypesList = function () {
      $scope.sealTypesList = [];
      angular.forEach($scope.sealTypes, function (sealType) {
        var sealTypeObject = $this.generateSealTypeObject(sealType);
        $scope.sealTypesList.push(sealTypeObject);
      });
    };

    this.getExistingSealsByType = function (typeId, storeId) {
      if (!$scope.existingSeals) {
        return;
      }

      var existingSealTypeObjects = $scope.existingSeals.filter(function (sealTypeObject) {
        return sealTypeObject.type === typeId && sealTypeObject.storeInstanceId === storeId;
      });

      var existingSeals = [];
      existingSealTypeObjects.forEach(function (sealTypeObject) {
        existingSeals.push(sealTypeObject.sealNumbers[0]);
      });

      return existingSeals;
    };

    this.determineSealsToDelete = function (sealTypeObject, storeId) {
      var existingSeals = this.getExistingSealsByType(sealTypeObject.id, storeId);
      var sealsToDelete = [];
      for (var key in existingSeals) {
        var sealNumber = existingSeals[key];
        sealsToDelete.push(sealNumber);
      }

      return sealsToDelete;
    };

    this.getExistingSealByNumber = function (sealNumber, sealType, storeId) {
      return $scope.existingSeals.filter(function (existingSeal) {
        return (existingSeal.sealNumbers[0] === sealNumber && existingSeal.type === parseInt(sealType) &&
        existingSeal.storeInstanceId === storeId);
      })[0];
    };

    this.makeDeleteSealsPromise = function (sealTypeObject, storeId) {
      var sealsToDelete = $this.determineSealsToDelete(sealTypeObject, storeId);
      if (sealsToDelete.length === 0) {
        return;
      }

      var deletePromises = [];
      for (var key in sealsToDelete) {
        var sealNumber = sealsToDelete[key];
        var existingSeal = this.getExistingSealByNumber(sealNumber, sealTypeObject.id, storeId);
        deletePromises.push(storeInstanceAssignSealsFactory.deleteStoreInstanceSeal(
          existingSeal.id,
          existingSeal.storeInstanceId
        ));
      }

      return deletePromises;
    };

    this.makeDeleteSealsPromises = function (storeId) {
      var promises = [];
      angular.forEach($scope.sealTypesList, function (sealTypeObject) {
        var deletePromises = $this.makeDeleteSealsPromise(sealTypeObject, storeId);
        if (deletePromises) {
          promises = promises.concat(deletePromises);
        }
      });

      return promises;
    };

    this.createPromiseToDeletePrevStoreItems = function () {
      var deleteItemsPromiseArray = [];
      if ($scope.prevStoreItemsToDelete) {
        angular.forEach($scope.prevStoreItemsToDelete, function (item) {
          deleteItemsPromiseArray.push(storeInstanceFactory.deleteStoreInstanceItem(item.storeInstanceId,
            item.id));
        });

        return deleteItemsPromiseArray;
      }
    };

    this.createPromiseToDeleteItems = function () {
      var deleteItemsPromiseArray = [];
      angular.forEach($scope.itemsToDelete, function (item) {
        deleteItemsPromiseArray.push(storeInstanceFactory.deleteStoreInstanceItem(item.storeInstanceId,
          item.id));
      });

      return deleteItemsPromiseArray;
    };

    this.successMessage = function (response, action) {
      $this.showMessage('success', 'Store ' +
        $routeParams.action + ' ' + response.id + ' ' +
        (action ? action : 'created') + '!');
    };

    this.exitOnSave = function (response) {
      $this.hideLoadingModal();
      var responseForSuccessMessage = Array.isArray(response) ? response[0] : response;
      $this.successMessage(responseForSuccessMessage, 'saved');
      $location.url('/store-instance-dashboard/');
    };

    this.findStatusObject = function (stepObject) {
      if (stepObject) {
        return lodash.findWhere($scope.storeDetails.statusList, {
          name: stepObject.stepName
        });
      }
    };

    this.updateStatusToStep = function (stepObject) {
      var statusObject = this.findStatusObject(stepObject);
      return storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusObject.name);
    };

    this.updateStoreInstanceSuccessHandler = function (response) {
      $this.successMessage(response, 'updated');
      $this.hideLoadingModal();
      if ($routeParams.action === 'replenish') {
        $this.nextStep.uri = $this.nextStep.uri.replace(/[0-9]+/, response.id);
      }

      //$location.url($this.nextStep.uri);
      if ($scope.undispatch) {
        $location.url($this.nextStep.uri).search({ undispatch: 'true' });
      } else {
        $location.url($this.nextStep.uri);
      }        

    };

    this.determineNextStepURI = function (response) {
      var uri = $this.nextStep.uri.replace('undefined', response.id);
      if ($routeParams.action !== 'dispatch') {
        uri = $this.nextStep.uri.replace(/[0-9]+/, response.id);
      }

      return uri;
    };

    this.createStoreInstanceSuccessHandler = function (response) {
      $this.successMessage(response[0]);
      var uri = $this.determineNextStepURI(response[0]);
      $this.hideLoadingModal();
      $localStorage.resetMinDate = {
        id: response[0].id
      };

      if ($scope.undispatch) {
        $location.url(uri).search({ undispatch: 'true' });
      } else {
        $location.url(uri);
      }        

    };

    this.displayErrorConfirmation = function (response) {
      $scope.storeConfirmationDialog = {
        title: 'The Store you selected is already associated to another Instance',
        confirmationCallback: function () {
          $location.url('/store-instance-dashboard/');
        },

        confirmationLabel: 'Go to dashboard',
        body: response.value,
        cancelLabel: 'Cancel'
      };
      angular.element('#confirmation-modal').modal('show');
    };

    this.createStoreInstanceErrorHandler = function (response) {
      $this.hideLoadingModal();
      var errorResp = null;
      if (angular.isDefined(response)) {
        errorResp = angular.copy(response.data);
      }

      if (angular.isDefined(errorResp) && errorResp !== null && angular.isDefined(errorResp[0]) && errorResp[0].code === '250') {
        $this.displayErrorConfirmation(errorResp[0]);
      } else {
        $scope.displayError = true;
        $scope.errorResponse = response;
      }

      return false;
    };

    this.resetErrors = function () {
      $scope.displayError = false;
      $scope.errorResponse = null;
    };

    this.showMessage = function (type, message) {
      messageService.display(type, message);
    };

    this.validateForm = function () {
      this.resetErrors();
      if ($scope.showDataLossWarning) {
        return $this.showWarningModal();
      }

      if ($scope.createStoreInstance.$valid && $scope.formData.menus.length > 0 && $scope.storeNumberValid) {
        return true;
      }

      $scope.displayError = true;
      return false;
    };

    this.exitToDashboard = function () {
      $location.url('/store-instance-dashboard/');
    };

    this.updateStoreInstance = function (saveAndExit) {
      this.showLoadingModal('Updating Store Instance ' + $routeParams.storeId);
      var payload = this.formatPayload();
      return storeInstanceFactory.updateStoreInstance($routeParams.storeId, payload).then(
        (saveAndExit ? this.exitOnSave : this.updateStoreInstanceSuccessHandler),
        $this.createStoreInstanceErrorHandler
      );
    };

    this.parsePrevInstanceStatus = function () {
      return Math.abs(parseInt($this.prevInstanceNextStep.storeOne.stepName) + 1).toString();
    };

    this.makeRedispatchPromises = function () {
      var prevInstanceStatus = this.parsePrevInstanceStatus();
      var payload = this.formatPayload('redispatch-initial');
      return {
        updateInstancePromises: [{
          f: storeInstanceFactory.updateStoreInstance,
          obj: storeInstanceFactory,
          args: [$routeParams.storeId, payload]
        }],
        updateInstanceStatusPromises: [{
          f: storeInstanceFactory.updateStoreInstanceStatus,
          obj: storeInstanceFactory,
          args: [$routeParams.storeId, prevInstanceStatus]
        }]
      };
    };

    this.checkForOnFloorInstance = function () {
      if ($scope.storeInstancesOnFloor) {
        var onFloorInstance = $scope.storeInstancesOnFloor.filter(function (instance) {
          return (instance.storeNumber === parseInt($scope.formData.storeNumber));
        });

        return onFloorInstance[0];
      }
    };

    $scope.goToActionState = function (actionState) {
      if (actionState) {
        $route.updateParams({
          action: actionState,
          storeId: $scope.onFloorInstance.id
        });
      }

      return;
    };

    this.displayConfirmDialog = function () {
      $scope.storeConfirmationDialog = {
        title: 'The Store you selected is already associated to another Instance',
        body: sprintf(
          'Currently Store Number %s for Schedule Date and Store Instance %d is in the "On Floor" status. You can either Redispatch this, End this, or press Cancel to select a different Store.',
          $scope.onFloorInstance.storeNumber, $scope.onFloorInstance.id),
        confirmationCallback: function () {
          $scope.goToActionState('redispatch');
        },

        confirmationLabel: 'Redispatch',
        alternativeCallback: function () {
          $scope.goToActionState('end-instance');
        },

        alternativeLabel: 'End Instance'
      };

      angular.element('#confirmation-modal').modal('show');
    };

    this.makeCreatePromises = function () {
      var payload = this.formatPayload();
      var promises = [];
      promises.push(storeInstanceFactory.createStoreInstance(payload));
      return promises;
    };

    this.createStoreInstance = function (saveAndExit) {
      if ($this.isActionState('dispatch')) {
        $scope.onFloorInstance = $this.checkForOnFloorInstance();
        if (angular.isDefined($scope.onFloorInstance) && $scope.onFloorInstance.id) {
          $this.displayConfirmDialog();
          return;
        }
      }

      var payload = $this.createGetMenuCatererListPayload();

      menuCatererStationsService.getRelationshipList(payload).then(function (menuCatererList) {
        $scope.menuCatererList = menuCatererList.companyMenuCatererStations;

        var expiredMenus = [];
        $scope.formData.menus.forEach(function (menu) {
          if (!lodash.findWhere($scope.menuCatererList, { menuId: menu.id })) {
            expiredMenus.push(menu.menuCode);
          }
        });

        if (expiredMenus.length > 0) {
          $scope.displayError = true;
          $scope.errorResponse = {
            statusText: 'Some of the selected menus or catering menu relationships is not active: ' + expiredMenus.join(', ')
          };
          return;
        }

        $this.showLoadingModal('Creating new Store Instance');
        var promises = $this.makeCreatePromises();
        $q.all(promises).then(
          (saveAndExit ? $this.exitOnSave : $this.createStoreInstanceSuccessHandler),
          $this.createStoreInstanceErrorHandler
        );
      });
    };

    this.invokeStoreInstanceStatusPromises = function (updateInstanceStatusPromises, saveAndExit) {
      $q.all(updateInstanceStatusPromises).then(
        (saveAndExit ? $this.exitOnSave : $this.createStoreInstanceSuccessHandler),
        $this.createStoreInstanceErrorHandler
      );
    };

    this.startPromise = function (preparedPromises) {
      return lodash.map(preparedPromises, function (promise) {
        return promise.f.apply(promise.obj, promise.args);
      });
    };

    this.createEditPromises = function (actionPayloadObj) {

      var endInstanceFlag = actionPayloadObj.actionOne === 'end-instance' ? true : false;
      var promises = {
        updateInstancePromises: [],
        updateInstanceStatusPromises: []
      };
      promises.updateInstancePromises.push({
        f: storeInstanceFactory.updateStoreInstance,
        obj: storeInstanceFactory,
        args: [$routeParams.storeId, actionPayloadObj.payload]
      });
      promises.updateInstanceStatusPromises.push({
        f: storeInstanceFactory.updateStoreInstanceStatus,
        obj: storeInstanceFactory,
        args: [$routeParams.storeId, $this.nextStep.stepName, false, endInstanceFlag]
      });
      if ($scope.prevStoreInstanceId && actionPayloadObj.actionTwo) {
        promises.updateInstancePromises.push({
          f: storeInstanceFactory.updateStoreInstance,
          obj: storeInstanceFactory,
          args: [$scope.prevStoreInstanceId, actionPayloadObj.prevPayload]
        });
        promises.updateInstanceStatusPromises.push({
          f: storeInstanceFactory.updateStoreInstanceStatus,
          obj: storeInstanceFactory,
          args: [$scope.prevStoreInstanceId, $this.nextStep.storeOne.stepName, false, endInstanceFlag]
        });
      }

      return promises;
    };

    this.makeEditPromises = function (actionOne, actionTwo) {
      var payload;
      var prevPayload;
      if (!actionOne && !actionTwo) {
        payload = this.formatPayload();
      }

      if (actionOne) {
        payload = this.formatPayload(actionOne);
      }

      if (actionTwo) {
        prevPayload = this.formatPayload(actionTwo);
      }

      var actionPayloadObj = {
        actionOne: actionOne,
        actionTwo: actionTwo,
        payload: payload,
        prevPayload: prevPayload
      };
      return $this.createEditPromises(actionPayloadObj);
    };

    this.endStoreInstance = function (saveAndExit) {
      this.showLoadingModal('Starting the End Instance process');
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }

      var promises = $this.makeEditPromises('end-instance');
      $q.all($this.startPromise(promises.updateInstancePromises)).then(function () {
          $this.invokeStoreInstanceStatusPromises($this.startPromise(promises.updateInstanceStatusPromises),
            saveAndExit);
        },

        $this.createStoreInstanceErrorHandler
      );
    };

    this.redispatchStoreInstance = function (saveAndExit) {
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }

      this.showLoadingModal('Redispatching Store Instance ' + $routeParams.storeId);
      var promises = $this.makeCreatePromises();
      var redispatchPromises = $this.makeRedispatchPromises();
      $q.all($this.startPromise(redispatchPromises.updateInstancePromises)).then(function () {
          $this.invokeStoreInstanceStatusPromises(promises.concat($this.startPromise(redispatchPromises.updateInstanceStatusPromises)),
            saveAndExit);
        },

        $this.createStoreInstanceErrorHandler
      );
    };

    this.removeAllDataForInstances = function () {
      return ($scope.existingSeals || $scope.itemsToDelete) && $scope.userConfirmedDataLoss && !this.isActionState('redispatch');
    };

    this.editRedispatchedStoreInstance = function (saveAndExit) {
      this.showLoadingModal('Updating Current Store Instance ' + $routeParams.storeId +
        ' and Previous Store Instance ' + $scope.prevStoreInstanceId);
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }

      var promises = $this.makeEditPromises('redispatch', 'redispatch-initial');
      var deletePromises = [];
      if ($this.removeAllDataForInstances()) {
        deletePromises.push($this.makeDeleteSealsPromises(parseInt($routeParams.storeId)));
        deletePromises.push($this.makeDeleteSealsPromises($scope.prevStoreInstanceId));
        deletePromises.push($this.createPromiseToDeleteItems());
        deletePromises.push($this.createPromiseToDeletePrevStoreItems());
      }

      $q.all(deletePromises.concat($this.startPromise(promises.updateInstancePromises))).then(function () {
          $this.invokeStoreInstanceStatusPromises($this.startPromise(promises.updateInstanceStatusPromises),
            saveAndExit);
        },

        $this.createStoreInstanceErrorHandler
      );
      if (angular.isDefined($localStorage.stepTwoFromStepOne)) {
        $localStorage.stepTwoFromStepOne.storeId = null;
      }
    };

    this.editDispatchedStoreInstance = function (saveAndExit) {
      this.showLoadingModal('Updating Store Instance ' + $routeParams.storeId);
      if (saveAndExit) {
        this.exitToDashboard();
        return;
      }

      var promises = $this.makeEditPromises('dispatch');
      var deletePromises = [];
      if ($this.removeAllDataForInstances()) {
        deletePromises.push($this.makeDeleteSealsPromises(parseInt($routeParams.storeId)));
        deletePromises.push($this.createPromiseToDeleteItems());
      }

      $q.all(deletePromises.concat($this.startPromise(promises.updateInstancePromises))).then(function () {
          $this.invokeStoreInstanceStatusPromises($this.startPromise(promises.updateInstanceStatusPromises),
            saveAndExit);
        },

        $this.createStoreInstanceErrorHandler
      );
    };

    this.redispatchConditions = function (saveAndExit) {
      if ($scope.stepOneFromStepTwo) {
        $this.editRedispatchedStoreInstance(saveAndExit);
        return;
      } else {
        $this.redispatchStoreInstance(saveAndExit);
        return;
      }
    };

    this.modifyStoreIdFromStepTwoExist = function () {
        var ls = $localStorage.replenishUpdateStep;
        if (angular.isDefined(ls) && angular.isDefined(ls.storeId)) {
          return ls.storeId;
        }

        return null;
      };

    this.submitFormConditions = function (saveAndExit) {
      if ($this.isActionState('end-instance')) {
        $this.endStoreInstance(saveAndExit);
        return;
      }

      if ($this.isActionState('replenish') && $localStorage.replenishUpdateStep) {
        $routeParams.replenishstoreId = $routeParams.storeId;
        $routeParams.storeId = $this.modifyStoreIdFromStepTwoExist();
        $this.updateStoreInstance(saveAndExit);
        return;
      }

      if ($this.isActionState('redispatch')) {
        return $this.redispatchConditions(saveAndExit);
      }

      if ($this.isActionState('dispatch') && $routeParams.storeId) {
        $this.editDispatchedStoreInstance(saveAndExit);
        return;
      }

      $this.createStoreInstance(saveAndExit);
    };

    $scope.submitForm = function (saveAndExit) {
      $scope.createStoreInstance.$setSubmitted(true);
      if ($this.validateForm()) {
        $this.submitFormConditions(saveAndExit);
      }

      return false;
    };

    $scope.omitSelectedMenus = function (menu) {
      var selectedMenu = $scope.formData.menus.filter(function (existingMenu) {
        return (existingMenu.id === menu.id);
      });

      return (selectedMenu.length === 0);
    };

    $scope.validateInput = function (fieldName) {
      if ($scope.createStoreInstance[fieldName].$pristine && !$scope.createStoreInstance.$submitted) {
        return '';
      }

      if ($scope.createStoreInstance[fieldName].$invalid || angular.isDefined($scope.createStoreInstance[
          fieldName]
          .$error.required)) {
        return 'has-error';
      }

      return 'has-success';
    };

    $scope.validateMenus = function () {
      if (angular.isUndefined($scope.createStoreInstance.menus) || $scope.createStoreInstance.menus
          .$pristine && !$scope.createStoreInstance.$submitted) {
        return '';
      }

      if ($scope.formData.menus.length === 0) {
        $scope.createStoreInstance.menus.$setValidity('required', false);
        return 'has-error';
      }

      $scope.createStoreInstance.menus.$setValidity('required', true);
      return 'has-success';
    };

    $scope.saveAndExit = function () {
      return $scope.submitForm(true);
    };

    $scope.isActionState = function (action) {
      return $this.isActionState(action);
    };

    $scope.isEndInstanceOrRedispatch = function () {
      return $this.isEndInstanceOrRedispatch();
    };

    $scope.menuPlaceholderText = function () {
      if ($routeParams.action !== 'dispatch') {
        return '';
      }

      var placeholder = 'Select one or more Menus';
      if ($scope.filteredMenuList.length === 0) {
        placeholder = 'No menus are available to select';
      }

      return placeholder;
    };

    $scope.proceedToStepTwo = function () {
      $this.hideWarningModal();
      $scope.showDataLossWarning = false;
      $scope.userConfirmedDataLoss = true;
      $scope.submitForm();
    };

    $scope.reloadRoute = function () {
      $this.hideWarningModal();
    };

    this.setFormScheduleNumber = function () {
      if ($scope.formData.scheduleNumber) {
        $scope.formData.scheduleNumber = lodash.findWhere($scope.scheduleNumbers,
          { scheduleNumber: $scope.formData.scheduleNumber.scheduleNumber });
        $scope.formData.scheduleId = lodash.findWhere($scope.scheduleNumbers,
          { id: $scope.formData.scheduleNumber.id });
        $scope.routesList = [];
        angular.forEach($scope.routesListCopy, function (route) {
          if (route.scheduleNumber === $scope.formData.scheduleNumber.scheduleNumber) {
            $scope.routesList.push(route);
          }
        });
      }
    };

    this.setScheduleNumbers = function (apiData) {
      $scope.routesList = angular.copy(apiData.schedules);
      $scope.routesListCopy = angular.copy(apiData.schedules);
      if ($routeParams.action === 'end-instance') {
        $scope.routesList = [];
        var scheduleObj = {
          id: $scope.formData.scheduleId,
          scheduleNumber: $scope.formData.scheduleNumber.scheduleNumber,
          departure: $scope.formData.scheduleNumber.departure,
          arrival: $scope.formData.scheduleNumber.arrival
        };
        $scope.formData.scheduleId = scheduleObj;
        $scope.scheduleNumbers.push(scheduleObj);
        $scope.routesList.push(scheduleObj);
      } else {
        $scope.scheduleNumbers = $filter('unique')(apiData.schedules, 'scheduleNumber');
      }

      $this.setFormScheduleNumber();
    };

    this.getScheduleNumbers = function () {
      var companyId = globalMenuService.getCompanyData().companyId;
      var datesForApi = $this.getFormattedDatesPayload();
      var operationalDays = this.getFormattedOperationalDaysPayload();
      schedulesService.getSchedulesInDateRange(companyId, datesForApi.startDate, datesForApi.endDate,
        operationalDays)
        .then(this.setScheduleNumbers);
    };

    this.updateInstanceDependenciesSuccess = function () {
      $this.filterMenusList();
      if ($this.isDispatchOrRedispatch() && angular.isDefined($scope.formData.cateringStationId)) {
        $this.removeInvalidMenus();
      }
    };

    this.updateInstanceDependencies = function () {
      var updatePromises = [
        $this.getScheduleNumbers(),
        $this.getCarrierNumbers(),
        $this.getCatererStationList()
      ];
      if ($this.isDispatchOrRedispatch()) {
        updatePromises.push(
          $this.getMenuMasterList(),
          $this.getMenuCatererList()
        );
      }

      if ($this.isActionState('replenish')) {
        if ($scope.storesList.length === 0) {
          updatePromises.push($this.getStoresList());
        } else {
          $this.validateReplenishStoreNumber();
        }
      }

      if ($this.isActionState('dispatch')) {
        if (!$scope.undispatch) {
          $scope.formData.storeNumber = '';
        }

        updatePromises.push($this.getStoresList());
      }

      $q.all(updatePromises).then(function () {
        $this.updateInstanceDependenciesSuccess();
      });
    };

    this.updateCatereStationDependencies = function () {
      var updatePromises = [
        $this.getMenuCatererList()
      ];

      $q.all(updatePromises).then(function () {
        $this.updateInstanceDependenciesSuccess();
      });
    };

    this.updateRouteList = function() {
      $scope.routesList = [];
      $scope.formData.scheduleId = null;
      angular.forEach($scope.routesListCopy, function (route) {
        if (route.scheduleNumber === $scope.formData.scheduleNumber.scheduleNumber) {
          $scope.routesList.push(route);
        }
      });

      if ($scope.routesList.length === 1) {
        $scope.formData.scheduleId = $scope.routesList[0];
      }
    };

    this.registerMenusScopeWatchers = function () {
      return ($this.isActionState('redispatch') && $scope.prevStoreInstanceId) || ($this.isActionState(
          'dispatch') &&
        $routeParams.storeId);
    };

    this.checkIfMenusHaveChanged = function (newMenus) {
      angular.forEach($scope.storeDetails.menuList, function (originalMenu) {
        var menu = newMenus.filter(function (menu) {
          return menu.id === originalMenu.id;
        })[0];

        if (angular.isUndefined(menu)) {
          $scope.showDataLossWarning = true;
        } else {
          $scope.showDataLossWarning = false;
        }
      });
    };

    this.registerScopeWatchers = function () {
      $scope.$watch('formData.scheduleDate', function (newDate, oldDate) {
        if (newDate && newDate !== oldDate) {
          if (!(oldDate === '' && newDate === dateUtility.nowFormattedDatePicker())) {
            $this.updateInstanceDependencies();
          }
        }
      });

      $scope.$watch('formData.scheduleNumber.scheduleNumber', function (newId, oldId) {
        if (newId && newId !== oldId) {
          $this.updateRouteList();
        }
      });

      if ($this.isActionState('dispatch')) {
        $scope.$watch('formData.cateringStationId', function (newId, oldId) {
          if (newId && newId !== oldId) {
            $this.updateCatereStationDependencies();
          }
        });
      }

      if ($this.isActionState('redispatch')) {
        $scope.$watch('formData.cateringStationId', function (newId, oldId) {
          if (newId && newId !== oldId) {
            $this.updateCatereStationDependencies();
          }
        });
      }

      if ($this.registerMenusScopeWatchers()) {
        $scope.$watch('formData.menus', function (newMenus, oldMenus) {
          if (newMenus && newMenus !== oldMenus) {
            $this.checkIfMenusHaveChanged(newMenus);
          }
        });
      }
    };

    this.showLoadingModal = function (text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.showWarningModal = function () {
      angular.element('#warning').modal('show');
    };

    this.hideWarningModal = function () {
      angular.element('#warning').modal('hide');
    };

    this.setUIReady = function () {
      $scope.uiSelectTemplateReady = true;
      $this.hideLoadingModal();
    };

    this.isStoreEdit = function () {
      return angular.isDefined($routeParams.storeId) && ($this.isActionState('dispatch') || $this.isActionState('end-instance'));
    };

    this.setInstanceScheduleDate = function() {
      if ($scope.scheduleDateOption === 1) {
        $scope.formData.scheduleDate = dateUtility.nowFormattedDatePicker();
      } else if ($scope.scheduleDateOption === 2) {
        $scope.formData.scheduleDate = dateUtility.tomorrowFormattedDatePicker();
      } else {
        $scope.formData.scheduleDate = '';
      }

    };

    this.setCompanyPreferenceForInstanceDate = function (dataFromAPI) {
      var preferencesArray = angular.copy(dataFromAPI.preferences);

      angular.forEach(preferencesArray, function (preference) {
        if (preference.featureName === 'Dispatch' && preference.choiceCode === 'CDTE' && preference.isSelected) {
          $scope.scheduleDateOption = 1;
        }else if (preference.featureName === 'Dispatch' && preference.choiceCode === 'TDTE' && preference.isSelected) {
          $scope.scheduleDateOption = 2;
        }
      });

      if (!$this.isStoreEdit() && !$this.isRedispatchOrReplenish() && $scope.scheduleDateOption === 1) {
        $scope.formData.scheduleDate = dateUtility.nowFormattedDatePicker();
      } else if (!$this.isStoreEdit() && !$this.isRedispatchOrReplenish() && $scope.scheduleDateOption === 2) {
        $scope.formData.scheduleDate = dateUtility.tomorrowFormattedDatePicker();
      } else if (!$this.isStoreEdit() && !$this.isRedispatchOrReplenish()) {
        $scope.formData.scheduleDate = '';
      }

      if ($scope.redispatchOrReplenishNew) {
        $this.setInstanceScheduleDate();
      }

      var promises = $this.makeInitPromises();
      $q.all(promises).then($this.initSuccessHandler);
    };

    this.getActiveCompanyPreferences = function () {
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker())
      };

      storeInstanceFactory.getCompanyPreferences(payload).then($this.setCompanyPreferenceForInstanceDate);
    };

    this.createInitPromises = function () {
      var promises = [
        $this.getCatererStationList(),
        $this.getCarrierNumbers(),
        $this.getScheduleNumbers(),
        $this.getInstancesOnFloor()
      ];
      return promises;
    };

    this.createEditInitPromises = function () {
      var promises = [
        $this.getSealTypes(),
        $this.getStoreInstanceSeals($routeParams.storeId),
        $this.getStoreInstanceItems($routeParams.storeId)
      ];
      if ($scope.prevStoreInstanceId && $routeParams.action === 'redispatch') {
        promises.push(
          $this.getPrevStoreDetails(),
          $this.getStoreInstanceSeals($scope.prevStoreInstanceId),
          $this.getPrevStoreInstanceItems($scope.prevStoreInstanceId)
        );
      }

      return promises;
    };

    this.makeInitPromises = function () {
      var promises = $this.createInitPromises();

      if ($this.isActionState('replenish')) {
        $scope.redispatchOrReplenishNew = true;
      } else {
        promises.push($this.getStoresList());
        promises.push($this.getMenuMasterList());
        promises.push($this.getMenuCatererList());
      }

      if ($this.isEditingDispatch() || $this.isEditingRedispatch()) {
        promises.push($this.getStoreDetails());
        promises.concat($this.createEditInitPromises());
      }

      return promises;
    };

    this.isMinDateReset = function () {
      if (angular.isDefined($localStorage.resetMinDate) && angular.isDefined($localStorage.resetMinDate.id)) {
        var id = parseInt($localStorage.resetMinDate.id);
        if (id === $routeParams.storeId) {
          return true;
        }

        if (angular.isDefined($scope.storeDetails) && id === $scope.storeDetails.storeInstanceNumber) {
          return true;
        }

        return false;
      }
    };

    this.minDateConditional = function () {
      if ($this.isMinDateReset()) {
        return dateUtility.nowFormattedDatePicker();
      } else if (!$this.isMinDateReset()) {
        return $this.determineMinDate();
      }
    };

    this.initSuccessHandlerMethods = function () {
      $scope.minDate = $this.minDateConditional();
      $this.filterMenusList();
      $this.setWizardSteps();
      if ($routeParams.storeId && !($this.isEndInstanceOrReplenish('replenish'))) {
        $this.setStoreInstanceMenus();
      }

      if ($this.isActionState('redispatch')) {
        $this.setPrevInstanceWizardSteps();
      }

      if ($routeParams.storeId && ($this.isActionState('redispatch') || $this.isActionState('dispatch'))) {
        $this.setExistingSeals();
        $this.generateSealTypesList();
      }
    };

    this.initSuccessHandler = function () {
      $this.initSuccessHandlerMethods();
      $this.setUIReady();
      $this.registerScopeWatchers();
    };

    this.init = function () {

      if ($routeParams.undispatch) {
        $scope.undispatch = true;
      }

      $scope.storeNumberValid = true;

      if ($routeParams.storeId) {
        $this.showLoadingModal('We are loading Store Instance ' + $routeParams.storeId + '.');
        $this.getStoreInstance();
      }

      if (!$routeParams.storeId) {
        $this.showLoadingModal('Hang tight, we are loading some data for you.');
        $this.getActiveCompanyPreferences();
      }

    };

    this.init();
  });
