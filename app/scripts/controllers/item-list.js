'use strict';

/**
 * @author Max Felker <max@bigroomstudios.com>
 * @ngdoc function
 * @name ts5App.controller:ItemListCtrl
 * @description
 * Contoller for the Retail Items List View
 */
angular.module('ts5App')
  .controller('ItemListCtrl', function ($scope, $http, itemsFactory,
                                        companiesFactory, dateUtility, $filter) {

    var $this = this;
    $scope.itemsList = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };
    $scope.openVersionId = 36;

    this.filterItems = function () {
      return $filter('filter')($scope.itemsList, $scope.search);
    };

    this.generateItemQuery = function () {
      var todaysDate = dateUtility.formatDate(dateUtility.now());
      var query = {
        startDate: todaysDate,
        sortBy: 'ASC',
        sortOn: 'itemName',
        limit: 100
      };

      angular.extend(query, $scope.search);

      if ($scope.dateRange.startDate && $scope.dateRange.endDate) {
        query.startDate = dateUtility.formatDateForAPI($scope.dateRange
          .startDate);
        query.endDate = dateUtility.formatDateForAPI($scope.dateRange
          .endDate);
      }
      return query;
    };

    this.nestVersions = function () {
      var currentMasterIndex = -1;
      var currentMasterId = -1;
      $scope.itemsList = $scope.itemsList.filter(function (item, index) {
        if (item.itemMasterId === currentMasterId) {
          $scope.itemsList[currentMasterIndex].versions.push(item);
        } else {
          currentMasterIndex = index;
          currentMasterId = item.itemMasterId;
          item.versions = [];
          return item;
        }
      });
    };

    this.getItemsList = function () {
      var query = this.generateItemQuery();
      var $this = this;
      itemsFactory.getItemsList(query).then(function (response) {
        $scope.itemsList = response.retailItems;
        $this.nestVersions();
        $this.hideLoadingModal();
      });
    };

    this.getItemTypesList = function () {
      itemsFactory.getItemTypesList().then(function (itemTypes) {
        $scope.itemTypes = itemTypes;
      });
    };

    this.getSalesCategoriesList = function () {
      companiesFactory.getSalesCategoriesList(function (data) {
        $scope.salesCategories = data.salesCategories;
      });
    };

    this.findItemIndex = function (itemId) {
      var itemIndex = 0;
      for (var key in $scope.itemsList) {
        var item = $scope.itemsList[key];
        if (item.id === itemId) {
          itemIndex = key;
          break;
        }
      }
      return itemIndex;
    };

    $scope.removeRecord = function (itemId) {
      var itemIndex = $this.findItemIndex(itemId);
      $this.displayLoadingModal('Removing Retail Item');
      itemsFactory.removeItem(itemId).then(function () {
        $this.hideLoadingModal();
        $scope.itemsList.splice(itemIndex, 1);
      });
    };

    this.parseDate = function (date) {
      return Date.parse(date);
    };

    $scope.isItemActive = function (date) {
      var parsedDate = $this.parseDate(date);
      var today = dateUtility.now();
      return parsedDate <= today;
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange.startDate = '';
      $scope.dateRange.endDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        delete $scope.search[filterKey];
      }
      $this.displayLoadingModal();
      $this.getItemsList();
    };

    $scope.hasSubVersions = function (item) {
      return (item.versions && item.versions.length > 0);
    };

    $scope.isOpen = function(item) {
      //return true;
      return (item.id === $scope.openVersionId);
    };

    $scope.toggleVersionVisibility = function(item) {
      if(item.versions.length <= 0) {
        return;
      }
      angular.element('#item-' + item.id).toggleClass('open-accordion');
      if($scope.openVersionId === item.id) {
        $scope.openVersionId = -1;
      } else {
        angular.element('#item-' + $scope.openVersionId).removeClass('open-accordion');
        $scope.openVersionId = item.id;
      }
    };

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    $scope.searchRecords = function () {
      $this.displayLoadingModal();
      $this.getItemsList();
    };

    this.getItemsList();
    this.getItemTypesList();
    this.getSalesCategoriesList();

  });
