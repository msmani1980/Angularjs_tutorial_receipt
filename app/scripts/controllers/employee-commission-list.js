'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCommissionListCtrl
 * @description
 * # EmployeeCommissionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCommissionListCtrl', function($scope, employeeCommissionFactory, dateUtility, messageService,
    $location, $filter, lodash) {

    $scope.viewName = 'Employee Commission';
    $scope.search = {
      startDate: '',
      endDate: '',
      itemList: [],
      priceTypeList: [],
      taxRateTypesList: [],
      selectedCategory: {}
    };
    $scope.itemListSearchQuery = {};
    $scope.commissionList = [];
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.$watchGroup(['search.startDate', 'search.endDate', 'search.selectedCategory'], function() {
      var payload = {};

      if (angular.isDefined($scope.search.startDate) && dateUtility.isDateValidForApp($scope.search.startDate)) {
        payload.startDate = dateUtility.formatDateForAPI($scope.search.startDate);
      }

      if (angular.isDefined($scope.search.endDate) && dateUtility.isDateValidForApp($scope.search.endDate)) {
        payload.endDate = dateUtility.formatDateForAPI($scope.search.endDate);
      }

      if (angular.isDefined($scope.search.selectedCategory)) {
        payload.categoryName = $scope.search.selectedCategory.name;
      }

      if (payload.startDate && payload.endDate) {
        employeeCommissionFactory.getItemsList(payload).then(function(dataFromAPI) {
          $scope.search.itemList = dataFromAPI.retailItems;
        });
      }
    });

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    function getSelectedObjectFromArrayUsingId(fromArray, id) {
      var filteredObject = $filter('filter')(fromArray, {
        id: id
      }, function(expected, actual) {
        return angular.equals(parseInt(expected), parseInt(actual));
      });

      if (filteredObject && filteredObject.length > 0) {
        return filteredObject[0];
      }

      return {};
    }

    function getSelectedPriceTypeObject(commissionObject) {
      if (!commissionObject.types || commissionObject.types.length === 0) {
        return {};
      }

      var priceId = commissionObject.types[0].priceTypeId;
      return getSelectedObjectFromArrayUsingId($scope.search.priceTypeList, priceId);
    }

    function getSelectedRateTypeObject(commissionObject) {
      if (!commissionObject.fixeds) {
        return {};
      }

      var rateTypeId = commissionObject.fixeds.length > 0 ? 1 : 2;
      return getSelectedObjectFromArrayUsingId($scope.search.taxRateTypesList, rateTypeId);
    }

    $scope.showCommission = function(commission) {
      $location.path('employee-commission/view/' + commission.id);
    };

    $scope.editCommission = function(commission) {
      $location.path('employee-commission/edit/' + commission.id);
    };

    $scope.isCommissionReadOnly = function(commission) {
      if (angular.isUndefined(commission)) {
        return false;
      }

      return !dateUtility.isAfterToday(commission.startDate);
    };

    $scope.isCommissionEditable = function(commission) {
      if (angular.isUndefined(commission)) {
        return false;
      }

      return dateUtility.isAfterToday(commission.endDate);
    };

    function showToastMessage(className, type, message) {
      messageService.display(className, '<strong>' + type + '</strong>: ' + message);
    }

    function showErrors(dataFromAPI) {
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }

      $scope.displayError = true;
      showToastMessage('warning', 'Employee Commission', 'error deleting commission!');
    }

    function successDeleteHandler() {
      showToastMessage('success', 'Employee Commission', 'successfully deleted commission!');
      $scope.searchCommissions();
    }

    $scope.deleteCommission = function() {
      angular.element('.delete-warning-modal').modal('hide');
      employeeCommissionFactory.deleteCommission($scope.commissionToDelete.id).then(successDeleteHandler,
        showErrors);
    };

    $scope.showDeleteConfirmation = function(commissionToDelete) {
      $scope.commissionToDelete = commissionToDelete;
      angular.element('.delete-warning-modal').modal('show');
    };

    function formatDatesForApp(commissionListData) {
      commissionListData.forEach(function(commissionObject) {
        if (commissionObject.startDate) {
          commissionObject.startDate = dateUtility.formatDateForApp(commissionObject.startDate);
        }

        if (commissionObject.endDate) {
          commissionObject.endDate = dateUtility.formatDateForApp(commissionObject.endDate);
        }
      });

      return commissionListData;
    }

    function setupTableData(dataToExtract) {
      dataToExtract.forEach(function(commissionObject) {
        commissionObject.itemName = commissionObject.item[0].itemName;
        commissionObject.priceTypeName = getSelectedPriceTypeObject(commissionObject).name;
        commissionObject.taxRateTypeName = getSelectedRateTypeObject(commissionObject).taxRateType;
      });

      return dataToExtract;
    }

    function prepareDataForTable(dataFromAPI) {
      var formattedData = formatDatesForApp(angular.copy(dataFromAPI));
      return setupTableData(formattedData);
    }

    function addDatesToPayload(payload) {
      if ($scope.search.startDate && $scope.search.endDate) {
        payload.startDate = dateUtility.formatDateForAPI($scope.search.startDate);
        payload.endDate = dateUtility.formatDateForAPI($scope.search.endDate);
      }
    }

    function addItemOrCategoryToPayload(payload) {
      var isCategorySelected = !!$scope.search.selectedCategory && !lodash.isEmpty($scope.search.selectedCategory);
      if ($scope.search.selectedItem) {
        payload.itemId = $scope.search.selectedItem.itemMasterId;
      } else if (!$scope.search.selectedItem && isCategorySelected) {
        // currently FE needs to send list of all itemIds in a category due to complications with sending only a categoryName to BE
        // TODO: fix if BE API is simplified
        payload.itemId = [];
        angular.forEach($scope.search.itemList, function(item) {
          payload.itemId.push(item.itemMasterId);
        });
      }
    }

    function addPriceAndRateTypeToPayload(payload) {
      if ($scope.search.selectedPriceType) {
        payload.priceTypeId = $scope.search.selectedPriceType.id;
      }

      if ($scope.search.selectedRateType) {
        payload.isFixed = ($scope.search.selectedRateType.taxRateType === 'Amount');
      }
    }

    function createSearchPayload() {
      var payload = {};
      addDatesToPayload(payload);
      addItemOrCategoryToPayload(payload);
      addPriceAndRateTypeToPayload(payload);
      return payload;
    }

    function getItemCategories() {
      employeeCommissionFactory.getItemsCategoriesList({}).then(function(response) {
        $scope.itemCategories = response.salesCategories;
      });
    }

    $scope.checkItemListAndNotifyIfEmpty = function() {
      if ($scope.search.endDate === '' || $scope.search.startDate === '') {
        showToastMessage('warning', 'Employee Commission',
          'Effective To & Effective From Dates must be completed before an Item Name can be selected');
      } else if ($scope.search.selectedCategory && $scope.search.itemList.length <= 0) {
        showToastMessage('warning', 'Employee Commission', 'There are no items in the Item Category you selected');
      }
    };

    employeeCommissionFactory.getPriceTypesList().then(function(dataFromAPI) {
      $scope.search.priceTypeList = dataFromAPI;
    });

    employeeCommissionFactory.getTaxRateTypes().then(function(dataFromAPI) {
      $scope.search.taxRateTypesList = dataFromAPI;
    });

    function init() {
      getItemCategories();
    }

    init();

    function getCommissionSuccessHandler(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      hideLoadingBar();
      $scope.commissionList = $scope.commissionList.concat(prepareDataForTable(dataFromAPI.employeeCommissions));
    }

    function loadEmployeeCommissions() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();
      var payload = lodash.assign(createSearchPayload(), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
      employeeCommissionFactory.getCommissionList(payload).then(getCommissionSuccessHandler);
      $this.meta.offset += $this.meta.limit;
    }

    $scope.loadEmployeeCommissions = function() {
      loadEmployeeCommissions();
    };

    $scope.searchCommissions = function() {
      $scope.commissionList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadEmployeeCommissions();
    };

    $scope.clearForm = function() {
      delete $scope.search.selectedPriceType;
      delete $scope.search.selectedRateType;
      delete $scope.search.selectedItem;
      delete $scope.search.itemList;
      delete $scope.search.selectedCategory;
      $scope.search.startDate = '';
      $scope.search.endDate = '';
      $scope.commissionList = [];
    };

  });
