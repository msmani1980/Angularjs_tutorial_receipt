'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCommissionListCtrl
 * @description
 * # EmployeeCommissionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCommissionListCtrl', function ($scope, employeeCommissionFactory, dateUtility, ngToast, $location, $filter) {
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

    $scope.$watchGroup(['search.startDate', 'search.endDate', 'search.selectedCategory'], function () {
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
        employeeCommissionFactory.getItemsList(payload).then(function (dataFromAPI) {
          $scope.search.itemList = dataFromAPI.retailItems;
        });
      }
    });

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    }

    function getSelectedObjectFromArrayUsingId(fromArray, id) {
      var filteredObject = $filter('filter')(fromArray, {id: id}, function (expected, actual) {
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

    $scope.showCommission = function (commission) {
      $location.path('employee-commission/view/' + commission.id);
    };

    $scope.editCommission = function (commission) {
      $location.path('employee-commission/edit/' + commission.id);
    };

    $scope.isCommissionReadOnly = function (commission) {
      if (angular.isUndefined(commission)) {
        return false;
      }
      return !dateUtility.isAfterToday(commission.startDate);
    };

    $scope.isCommissionEditable = function (commission) {
      if (angular.isUndefined(commission)) {
        return false;
      }
      return dateUtility.isAfterToday(commission.endDate);
    };

    function showToastMessage(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
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

    $scope.deleteCommission = function () {
      angular.element('.delete-warning-modal').modal('hide');
      employeeCommissionFactory.deleteCommission($scope.commissionToDelete.id).then(successDeleteHandler, showErrors);
    };

    $scope.showDeleteConfirmation = function (commissionToDelete) {
      $scope.commissionToDelete = commissionToDelete;
      angular.element('.delete-warning-modal').modal('show');
    };

    function formatDatesForApp(commissionListData) {
      commissionListData.forEach(function (commissionObject) {
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
      dataToExtract.forEach(function (commissionObject) {
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

    function getCommissionSuccessHandler(dataFromAPI) {
      hideLoadingModal();
      if(dataFromAPI.employeeCommissions) {
        $scope.commissionList = prepareDataForTable(dataFromAPI.employeeCommissions);
      } else {
        $scope.commissionList = [];
      }
    }

    function createSearchPayload() {
      var payload = {};
      if($scope.search.startDate && $scope.search.endDate) {
        payload.startDate = dateUtility.formatDateForAPI($scope.search.startDate);
        payload.endDate = dateUtility.formatDateForAPI($scope.search.endDate);
      }
      if($scope.search.selectedItem) {
        payload.itemId = $scope.search.selectedItem.itemMasterId;
      }
      if($scope.search.selectedPriceType) {
        payload.priceTypeId = $scope.search.selectedPriceType.id;
      }
      if($scope.search.selectedRateType) {
        payload.isFixed = ($scope.search.selectedRateType.taxRateType === 'Amount');
      }
      if($scope.search.selectedCategory) {
        payload.itemCategoryId = $scope.search.selectedCategory.id;
      }
      return payload;
    }

    function getCommissions (payload) {
      showLoadingModal('Loading Employee Commission List');
      employeeCommissionFactory.getCommissionList(payload).then(getCommissionSuccessHandler);
    }

    function getItemCategories() {
      employeeCommissionFactory.getItemsCategoriesList({}).then(function (response) {
        $scope.itemCategories = response.salesCategories;
      });
    }

    $scope.searchCommissions = function () {
      var payload = createSearchPayload();
      getCommissions(payload);
    };

    $scope.clearForm = function () {
      delete $scope.search.selectedPriceType;
      delete $scope.search.selectedRateType;
      delete $scope.search.selectedItem;
      delete $scope.search.itemList;
      delete $scope.search.selectedCategory;
      $scope.search.startDate = '';
      $scope.search.endDate = '';
      employeeCommissionFactory.getCommissionList({}).then(getCommissionSuccessHandler);
    };

    employeeCommissionFactory.getPriceTypesList().then(function (dataFromAPI) {
      $scope.search.priceTypeList = dataFromAPI;
    });

    employeeCommissionFactory.getTaxRateTypes().then(function (dataFromAPI) {
      $scope.search.taxRateTypesList = dataFromAPI;
    });

    function init () {
      getCommissions({});
      getItemCategories();
    }

    init();

  });
