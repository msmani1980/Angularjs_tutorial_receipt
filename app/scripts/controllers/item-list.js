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
      var filteredItems = $this.filterItems();
      $scope.itemsListCount = filteredItems.length;
      $this.setPaginatedItems(filteredItems);
    };

    this.filterItems = function () {
      var dateFiltered = $filter('daterange')($scope.itemsList, $scope.dateRange
        .startDate,
        $scope.dateRange.endDate);
      return $filter('filter')(dateFiltered, $scope.search);
    };

    this.setPaginatedItems = function (filteredItems) {
      var currentPage = parseInt($scope.currentPage);
      var itemsPerPage = parseInt($scope.itemsPerPage);
      var begin = ((currentPage - 1) * itemsPerPage);
      var end = begin + itemsPerPage;
      $scope.paginatedItems = filteredItems.slice(begin, end);
    };

    this.getItemsList = function () {
      var $this = this;
      itemsFactory.getItemsList({}).then(function (response) {
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

    $scope.isItemActive = function (startDate) {
      return Date.parse(startDate) <= dateUtility.now();
    };

    $scope.isItemInactive = function (endDate) {
      return Date.parse(endDate) <= dateUtility.now();
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

    $scope.$watch('dateRange.startDate + dateRange.endDate', function () {
      $this.updateItemList();
    });

    $scope.$watch('currentPage + itemsPerPage', function () {
      $this.updateItemList();
    });

    this.getItemsList();
    this.getItemTypesList();
    this.getSalesCategoriesList();

  });
