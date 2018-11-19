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
    $scope.validation = Utils.validation;

    $scope.viewName = 'Rule Management';
    $scope.readOnly = false;
    $scope.shouldDisableStartDate = false;
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
      startDate: '',
      endDate: '',
      selectedMenus: [],
      selectedItems: []
    };
    
    $scope.isEffective = function(menuRuleData) {
      return $scope.readOnly || $scope.isCurrentEffectiveDate(menuRuleData);
    };

    $scope.shouldDisableStartDate = function(startDate) {
      return dateUtility.isTodayDatePicker(startDate) || !(dateUtility.isAfterTodayDatePicker(startDate));
    };
    
    $scope.isCurrentEffectiveDate = function (menuRuleDate) {
      return (dateUtility.isTodayOrEarlierDatePicker(menuRuleDate.startDate) && (dateUtility.isAfterTodayDatePicker(menuRuleDate.endDate) || dateUtility.isTodayDatePicker(menuRuleDate.endDate)));
    };
    
    $scope.isFutureEffectiveDate = function (menuRuleDate) {
      return (dateUtility.isAfterTodayDatePicker(menuRuleDate.startDate) && (dateUtility.isAfterTodayDatePicker(menuRuleDate.endDate)));
    };
    
    $scope.isMenuRuleReadOnly = function () {
      if ($routeParams.action === 'create' || (angular.isUndefined($scope.formData))) {
        return false;
      }

      if ($routeParams.action === 'view') {
        return true;
      }

      return !dateUtility.isAfterTodayDatePicker($scope.formData.startDate);
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
    
    $scope.filterItemListByCategory = function (item) {
      menuRulesFactory.getItemsList({ categoryId: item.selectedCategory.id }, { fetchFromMaster: 'master' }).then(function(response) {
        item.items = response.masterItems;
      }, $this.saveFormFailure);
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
      var createPayload = this.generatePayloadCreateUpdate();
      delete createPayload.id;
      angular.forEach(createPayload.cabins, function(cabin) {
        if (cabin.menus !== undefined) {
          cabin.menus.forEach(function(menu) {
            delete menu.id;
          });
        }

        if (cabin.items !== undefined) {
          cabin.items.forEach(function(item) {
            delete item.id;
          });
        }
      });

      menuRulesFactory.createMenuRule(createPayload).then($this.saveFormSuccess, $this.saveFormFailure);
    };
    
    this.generatePayloadCreateUpdate = function() {
      var payloadMenus = [];
      var payloadItems = [];

      $scope.formData.selectedMenus.forEach(function (menus, cabinClass) {
          menus.forEach(function (menu) {
            payloadMenus.push({
              id: angular.isDefined(menu.id) ? parseInt(menu.id) : null,
              menuQty: menu.menuQty,
              menuId: menu.menu.menuId,
              companyCabinClassId: cabinClass
            });
          });
        });

      $scope.formData.selectedItems.forEach(function (items, cabinClass) {
          items.forEach(function (item) {
            payloadItems.push({
              id: angular.isDefined(item.id) ? parseInt(item.id) : null,
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

      var payloadCreateUpdate = {
        id: angular.isDefined($routeParams.id) ? parseInt($routeParams.id) : null,
        scheduleNumber: $scope.formData.scheduleNumber,
        days: daysArray,
        departureStationId: $scope.formData.departureStationId,
        arrivalStationId: $scope.formData.arrivalStationId,
        departureTimeFrom: $scope.formData.departureTime,
        departureTimeTo: $scope.formData.arrivalTime,
        startDate: dateUtility.formatDateForAPI($scope.formData.startDate),
        endDate: dateUtility.formatDateForAPI($scope.formData.endDate),
        cabins: this.constructSelectedMenusItems(payloadItems, payloadMenus),
        companyCarrierTypeId: angular.isDefined($scope.formData.companyCarrierTypeId) ? $scope.formData.companyCarrierTypeId : null
      };
      return payloadCreateUpdate;
    };
    
    this.constructSelectedMenusItems = function(payloadItems, payloadMenus) {
    
      var payloadItemsMap = _.chain(payloadItems).groupBy('companyCabinClassId').map(function(payloadItem) {
        return {
          items: payloadItem,
          companyCabinClassId: payloadItem[0].companyCabinClassId
        };
      }).value();
    
      var payloaMenusMap = _.chain(payloadMenus).groupBy('companyCabinClassId').map(function(payloadMenu) {
        return {
          menus: payloadMenu,
          companyCabinClassId: payloadMenu[0].companyCabinClassId
        };
      }).value();
        
      var mergedArray = _.zip(payloadItemsMap, payloaMenusMap);
        
      var finalMenusItems = [];
      var arrayOfMenuItems = [];
        
      angular.forEach(mergedArray, function (rootVal) {
          angular.forEach(rootVal, function (value) {
            finalMenusItems.push(value);
          });
        });
        
      finalMenusItems.forEach(function(value) {
          var existing = arrayOfMenuItems.filter(function(v) {
            if (v === undefined || value === undefined) { 
              return;
            }

            return v.companyCabinClassId === value.companyCabinClassId;
          });
        
          if (existing.length) {
            var existingIndex = arrayOfMenuItems.indexOf(existing[0]);
            arrayOfMenuItems[existingIndex] = Object.assign(value, arrayOfMenuItems[existingIndex]);
          } else if (value !== undefined) {
            arrayOfMenuItems.push(value);
          } 
        });

      return arrayOfMenuItems;
    };
    
    this.editMenuRules = function() {
      $this.showLoadingModal('Updating Menu Rules Data');
      var updatePayload = this.generatePayloadCreateUpdate();
      menuRulesFactory.updateMenuRule(updatePayload).then($this.saveFormSuccess, $this.saveFormFailure);
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
      $scope.formData = angular.copy(dataFromAPI);
      angular.extend($scope.formData, {
        startDate: dateUtility.formatDateForApp($scope.formData.startDate),
        endDate: dateUtility.formatDateForApp($scope.formData.endDate),
        departureTime: $scope.formData.departureTimeFrom,
        arrivalTime: $scope.formData.departureTimeTo,
        days: $this.formatDaysOfWeekForEdit($scope.formData.days),
        selectedMenus: [],
        selectedItems: []
      });
    };
        
    this.formatDaysOfWeekForEdit = function (days) {
      if (!days || days === '{}') {
        return [];
      }

      return days.replace('{', '')
        .replace('}', '')
        .split(',')
        .map(Number)
          .map(function (day) {
            return lodash.find($scope.daysOfOperation, { id: day });
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
        if ($scope.formData.cabins !== undefined) {
          $scope.formData.cabins.forEach(function(cabinMenus) {
            var isMenuExist = lodash.filter(cabinMenus.menus, { companyCabinClassId: cabinClass.id });
            if (isMenuExist !== undefined && isMenuExist.length > 0) {
              $scope.formData.selectedMenus[cabinClass.id] = isMenuExist;
            }
          });

          if ($scope.formData.selectedMenus.length > 0 && $scope.formData.selectedMenus[cabinClass.id] !== undefined) {
            $scope.formData.selectedMenus[cabinClass.id].forEach(function(menu) {
              menu.rawMenu = menu;
              menu.menu = lodash.find($scope.menuMasters, { id: menu.menuId });
              if (!menu.menu) {
                menu.expired = true;
              }
            }); 
          }
          
        }
        
        if ($scope.formData.selectedMenus[cabinClass.id] === undefined) {
          $scope.formData.selectedMenus[cabinClass.id] = [];
        }
        
      });
    };

    this.constructSelectedItems = function () {
        $scope.companyCabinClasses.forEach(function (cabinClass) {
        
          if ($scope.formData.cabins !== undefined) {
            $scope.formData.cabins.forEach(function(cabinItems) {
              var isItemExist = lodash.filter(cabinItems.items, { companyCabinClassId: cabinClass.id });
              if (isItemExist !== undefined && isItemExist.length > 0) {
                $scope.formData.selectedItems[cabinClass.id] = isItemExist;
              }
            });

            if ($scope.formData.selectedItems.length > 0 && $scope.formData.selectedItems[cabinClass.id] !== undefined) {
              $scope.formData.selectedItems[cabinClass.id].forEach(function(item) {
                item.rawItem = item;
                item.item = lodash.find($scope.items, { id: item.itemId });
                item.items = $scope.items;

                if (!item.item) {
                  item.expired = true;
                }
              });
            }
          }
          
          if ($scope.formData.selectedItems[cabinClass.id] === undefined) {
            $scope.formData.selectedItems[cabinClass.id] = [];
          }
          
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
      if ($routeParams.id) {
        menuRulesFactory.getMenuRule($routeParams.id).then($this.getMenuRuleSuccess);
      }

      var promises = [
        menuRulesFactory.getSchedules(companyId),
        menuRulesFactory.getCompanyGlobalStationList({ startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()) }),
        menuRulesFactory.getCarrierTypes(companyId),
        menuRulesFactory.getSalesCategoriesList(),
        menuRulesFactory.getCabinClassesList({}),
        menuRulesFactory.getMenuMasterList({ startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()) }),
        menuRulesFactory.getItemsList({ startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()) }, { fetchFromMaster: 'master' })
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
