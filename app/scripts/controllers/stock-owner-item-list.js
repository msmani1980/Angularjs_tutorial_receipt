'use strict';

/**
 * @author Max Felker <max@bigroomstudios.com>
 * @ngdoc function
 * @name ts5App.controller:StockOwnerItemListCtrl
 * @description
 * Controller for the Stock Owner Items List view
 */
angular.module('ts5App')
  .controller('StockOwnerItemListCtrl', function ($scope, $http, itemsFactory,
    companiesFactory, dateUtility, $filter) {

    var $this = this;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.itemsList = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };

    this.updateItemList = function () {
      var sortedItems = $this.sortItems();
      var filteredItems = $this.filterItems(sortedItems);
      $scope.itemsListCount = filteredItems.length;
      $this.setPaginatedItems(filteredItems);
    };

    this.filterItems = function (sortedItems) {
      return $filter('filter')(sortedItems, $scope.search);
    };

    this.sortItems = function () {
      return $filter('orderBy')($scope.itemsList, 'itemName');
    };
    this.parsePaginationToInt = function () {
      $scope.currentPageInt = parseInt($scope.currentPage);
      $scope.itemsPerPageInt = parseInt($scope.itemsPerPage);
    };

    this.setPaginatedItems = function (filteredItems) {
      this.parsePaginationToInt();
      var begin = (($scope.currentPageInt - 1) * $scope.itemsPerPageInt);
      var end = begin + $scope.itemsPerPageInt;
      $scope.paginatedItems = filteredItems.slice(begin, end);
    };

    this.generateItemQuery = function () {
      var query = {};
      var todaysDate = dateUtility.formatDate(dateUtility.now());
      if ($scope.dateRange.startDate && $scope.dateRange.endDate) {
        query.startDate = dateUtility.formatDate($scope.dateRange.startDate,
          'L', 'YYYYMMDD');
        query.endDate = dateUtility.formatDate($scope.dateRange.endDate,
          'L', 'YYYYMMDD');
      } else {
        query.startDate = todaysDate;
      }
      return query;
    };

    this.getItemsList = function () {
      var query = this.generateItemQuery();
      var $this = this;
      itemsFactory.getItemsList(query).then(function (response) {
        $scope.itemsList = response.retailItems;
        $scope.itemsListCount = $scope.itemsList.length;
        $this.updateItemList();
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

    $scope.removeItem = function (itemId) {
      var itemIndex = $this.findItemIndex(itemId);
      angular.element('#loading').modal('show').find('p').text(
        'Removing your item');
      itemsFactory.removeItem(itemId).then(function () {
        angular.element('#loading').modal('hide');
        $scope.itemsList.splice(itemIndex, 1);
        $this.updateItemList();
      });
    };

    this.parseStartDate = function (startDate) {
      return Date.parse(startDate);
    };

    this.parseEndDate = function (endDate) {
      return Date.parse(endDate);
    };

    $scope.isItemActive = function (startDate) {
      var parsedDate = $this.parseStartDate(startDate);
      return parsedDate <= dateUtility.now();
    };

    $scope.isItemInactive = function (endDate) {
      var parsedDate = $this.parseEndDate(endDate);
      return parsedDate <= dateUtility.now();
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange.startDate = '';
      $scope.dateRange.endDate = '';
      $scope.startDateFilter = '';
      $scope.endDateFilter = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        $scope.search[filterKey] = '';
      }
      $scope.itemsListCount = $scope.itemsList.length;
    };

    $scope.$watch('search', function () {
      $this.updateItemList();
    }, true);

    $scope.$watchCollection('dateRange', function () {
      $this.getItemsList();
    });

    $scope.$watch('currentPage + itemsPerPage', function () {
      $this.updateItemList();
    });

    this.getItemsList();
    this.getItemTypesList();
    this.getSalesCategoriesList();

  });
