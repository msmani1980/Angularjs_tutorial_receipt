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
    $scope.startDateFilter = '';
    $scope.endDateFilter = '';

    this.formatDateFilter = function () {
      if ($scope.dateRange.startDate && $scope.dateRange.endDate) {
        $scope.startDateFilter = dateUtility.formatDate($scope.dateRange.startDate,
          'L',
          'YYYY-MM-DD');
        $scope.endDateFilter = dateUtility.formatDate($scope.dateRange.endDate,
          'L',
          'YYYY-MM-DD');
      }
    };

    this.updateItemList = function () {
      var filteredItems = $this.filterItems();
      $scope.itemsListCount = filteredItems.length;
      $this.setPaginatedItems(filteredItems);
    };

    this.filterItems = function () {
      this.formatDateFilter();
      var dateFiltered = $filter('daterange')($scope.itemsList, $scope.startDateFilter,
        $scope.endDateFilter);
      return $filter('filter')(dateFiltered, $scope.search);
    };

    this.setPaginatedItems = function (filteredItems) {
      if (filteredItems.length > 0) {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;
        $scope.paginatedItems = filteredItems.slice(begin, end);
      }
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

    $scope.removeItem = function (itemToDelete) {
      angular.element('#loading').modal('show').find('p').text(
        'Removing your item');
      itemsFactory.removeItem(itemToDelete.id).then(function () {
        angular.element('#loading').modal('hide');
        $scope.itemsList.splice(itemToDelete.itemKey, 1);
      });
    };

    $scope.isItemActive = function (startDate) {
      return Date.parse(startDate) <= dateUtility.now();
    };

    $scope.isItemInactive = function (endDate) {
      return Date.parse(endDate) <= dateUtility.now();
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange.endDate = '';
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

    $scope.$watch('dateRange', function () {
      $this.updateItemList();
    }, true);

    $scope.$watch('currentPage + itemsPerPage', function () {
      $this.updateItemList();
    });

    this.getItemsList();
    this.getItemTypesList();
    this.getSalesCategoriesList();

  });
