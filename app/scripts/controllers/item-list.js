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

    $scope.parseStartDate = function (startDate) {
      $scope.startDateParsed = Date.parse(startDate);
      startDate = $scope.startDateParsed;
      return startDate;
    };

    $scope.parseEndDate = function (endDate) {
      $scope.endDateParsed = Date.parse(endDate);
      endDate = $scope.endDateParsed;
      return endDate;
    };

    $scope.isItemActive = function (startDate) {
      $scope.parseStartDate();
      return startDate <= dateUtility.now();
    };

    $scope.isItemInactive = function (endDate) {
      $scope.parseEndDate();
      return endDate <= dateUtility.now();
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
