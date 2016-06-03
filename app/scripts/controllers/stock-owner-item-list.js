'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StockOwnerItemListCtrl
 * @description
 * Controller for the Stock Owner Items List view
 */
angular.module('ts5App')
  .controller('StockOwnerItemListCtrl', function($scope, $http, itemsFactory, companiesFactory, dateUtility, $filter) {

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.itemsList = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };

    this.updateItemList = function() {
      $scope.itemsListCount = $scope.itemsList.length;
      $scope.totalItems = $scope.itemsListCount;
      $this.setPaginatedItems($scope.itemsList);
    };

    this.filterItems = function() {
      return $filter('filter')($scope.itemsList, $scope.search);
    };

    this.parsePaginationToInt = function() {
      $scope.currentPageInt = parseInt($scope.currentPage);
      $scope.itemsPerPageInt = parseInt($scope.itemsPerPage);
    };

    this.setPaginatedItems = function(filteredItems) {
      $this.parsePaginationToInt();
      var begin = (($scope.currentPageInt - 1) * $scope.itemsPerPageInt);
      var end = begin + $scope.itemsPerPageInt;
      $scope.paginatedItems = filteredItems.slice(begin, end);
    };

    this.generateItemQuery = function() {
      var todaysDate = dateUtility.formatDate(dateUtility.now());
      var query = {
        startDate: todaysDate,
        sortBy: 'ASC',
        sortOn: 'itemName',
        limit: $this.meta.limit,
        offset: $this.meta.offset
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

    this.getItemsList = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      var query = $this.generateItemQuery();
      itemsFactory.getItemsList(query).then(function(response) {
        $this.meta.count = $this.meta.count || response.meta.count;

        var itemListFromAPI = angular.copy(response.retailItems);
        $scope.itemsList = itemListFromAPI;
        $scope.itemsListCount = $scope.itemsList.length;
        $this.updateItemList();
        $this.hideLoadingModal();
      });

      $this.meta.offset += $this.meta.limit;
    };

    this.getItemTypesList = function() {
      itemsFactory.getItemTypesList().then(function(itemTypes) {
        $scope.itemTypes = itemTypes;
      });
    };

    this.getSalesCategoriesList = function() {
      companiesFactory.getSalesCategoriesList(function(data) {
        $scope.salesCategories = data.salesCategories;
      });
    };

    this.findItemIndex = function(itemId) {
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

    $scope.removeRecord = function(itemId) {
      var itemIndex = $this.findItemIndex(itemId);
      $this.displayLoadingModal('Removing SO Item');
      itemsFactory.removeItem(itemId).then(function() {
        $this.hideLoadingModal();
        $scope.itemsList.splice(itemIndex, 1);
        $this.updateItemList();
      });
    };

    this.parseDate = function(date) {
      return Date.parse(date);
    };

    $scope.isItemActive = function(date) {
      var parsedDate = $this.parseDate(date);
      var today = dateUtility.now();
      return parsedDate <= today;
    };

    function hasLength(data) {
      return angular.isDefined(data) && data.length;
    }

    function searchIsDirty() {
      var s = $scope.search;
      var check = [];
      for (var search in s) {
        if (angular.isDefined(search) && hasLength(search)) {
          check.push(search);
        }
      }

      return (check.length);
    }

    $scope.clearSearchFilters = function() {
      $scope.dateRange.startDate = '';
      $scope.dateRange.endDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        delete $scope.search[filterKey];
      }

      $scope.itemsList = [];
    };

    $scope.showClearButton = function() {
      var d = $scope.dateRange;
      return (searchIsDirty() || d.startDate.length || d.endDate.length || $scope.itemsList.length);
    };

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
      angular.element('.loading-more').show();
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
      angular.element('.loading-more').hide();
    };

    $scope.searchRecords = function() {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $this.displayLoadingModal();
      $this.getItemsList();
    };

    $scope.$watch('currentPage + itemsPerPage + search', function() {
      $this.updateItemList();
    });

    this.getItemTypesList();
    this.getSalesCategoriesList();

    $scope.loadItems = $this.getItemsList;

  });
