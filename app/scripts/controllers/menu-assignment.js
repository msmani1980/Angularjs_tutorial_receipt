'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuAssignmentCtrl
 * @description
 * # MenuAssignmentCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuAssignmentCtrl', function (
    $scope, dateUtility, messageService, menuAssignmentFactory, companiesFactory, menuMasterService, itemsFactory, categoryFactory, $location, $routeParams, $q, lodash, $http
  ) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Schedule Menu Assignment';
    $scope.readOnly = false;
    $scope.isEdit = false;
    $scope.company = { };
    $scope.menuMasters = { };
    $scope.menuAssignment = { };
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

    $scope.filterItemListByCategory = function (item) {
      item.items = (item.selectedCategory) ? lodash.filter($scope.items, { categoryName: item.selectedCategory.name }) : $scope.items;
    };

    $scope.formSave = function () {
      if (!$this.validateForm()) {
        return false;
      }

      $this.showLoadingModal('Saving Menu Assignment');

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
            itemId: item.item.masterItem.id,
            companyCabinClassId: cabinClass
          });
        });
      });

      var payload = {
        source: 'Manual',
        menus: payloadMenus,
        items: payloadItems
      };

      menuAssignmentFactory.updateMenuAssignment($routeParams.id, payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    $scope.getUpdateBy = function (menu) {
      if (menu.updatedByPerson) {
        return menu.updatedByPerson.userName;
      }

      if (menu.createdByPerson) {
        return menu.createdByPerson.userName;
      }

      return 'Unknown';
    };

    $scope.getUpdatedOn = function (menu) {
      if (!menu.createdOn) {
        return 'Unknown';
      }

      return menu.updatedOn ? dateUtility.formatTimestampForApp(menu.updatedOn) : dateUtility.formatTimestampForApp(menu.createdOn);
    };

    this.validateForm = function() {
      $scope.displayError = !$scope.menuAssignmentDataForm.$valid;
      return $scope.menuAssignmentDataForm.$valid;
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.editInit = function() {
      if (dateUtility.isYesterdayOrEarlierDatePicker($scope.menuAssignment.scheduleDate)) {
        $scope.readOnly = true;
      }

      $scope.isEdit = true;
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.saveFormSuccess = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('success', 'Edit Menu Assignment', 'success');

      $location.path('menu-assignment-list');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.getMenuMasterAndItemsList = function() {
      var scheduleDate = dateUtility.formatDateForAPI($scope.menuAssignment.scheduleDate);
      var payload = { startDate: scheduleDate, endDate: scheduleDate };

      $q.all([
        menuMasterService.getMenuMasterList(payload),
        itemsFactory.getItemsList(payload)
      ]).then($this.getMenuMasterAndItemsListSuccess);
    };

    this.getMenuMasterAndItemsListSuccess = function(dataFromAPI) {
      $scope.menuMasters = angular.copy(dataFromAPI[0].companyMenuMasters);
      $scope.items = angular.copy(dataFromAPI[1].retailItems);

      $this.constructSelectedMenus();
      $this.constructSelectedItems();

      $this.hideLoadingModal();
    };

    this.getMenuAssignmentSuccess = function(dataFromAPI) {
      $scope.menuAssignment = angular.copy(dataFromAPI);

      angular.extend($scope.menuAssignment, {
        startDate: dateUtility.formatDateForApp($scope.menuAssignment.startDate),
        endDate: dateUtility.formatDateForApp($scope.menuAssignment.endDate),
        scheduleDate: dateUtility.formatDateForApp($scope.menuAssignment.scheduleDate)
      });
    };

    this.getCompanySuccess = function(dataFromAPI) {
      $scope.company = angular.copy(dataFromAPI);
    };

    this.getCategoriesSuccess = function(dataFromAPI) {
      $scope.categories = angular.copy(dataFromAPI.salesCategories);
    };

    this.constructSelectedMenus = function() {
      $scope.company.companyCabinClasses.forEach(function (cabinClass) {
        $scope.formData.selectedMenus[cabinClass.id] = lodash.filter($scope.menuAssignment.menus, { companyCabinClassId: cabinClass.id });

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
      $scope.company.companyCabinClasses.forEach(function (cabinClass) {
        $scope.formData.selectedItems[cabinClass.id] = lodash.filter($scope.menuAssignment.items, { companyCabinClassId: cabinClass.id });

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

    this.initDependenciesSuccess = function(result) {
      $this.getMenuAssignmentSuccess(result[0]);
      $this.getCompanySuccess(result[1]);
      $this.getCategoriesSuccess(result[2]);

      $this.getMenuMasterAndItemsList();

      $this.editInit();
    };

    this.makeInitPromises = function() {
      companyId = menuAssignmentFactory.getCompanyId();

      var promises = [
        menuAssignmentFactory.getMenuAssignment($routeParams.id),
        companiesFactory.getCompany(companyId),
        categoryFactory.getCategoryList()
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
