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
    companiesFactory, dateUtility) {

    // set search and start dates to nothing
    $scope.search = {
      startDate: '',
      endDate: ''
    };

    $scope.startDateFilter = '';
    $scope.endDateFilter = '';

    $scope.$watch('search.startDate + search.endDate', function () {
      $scope.formatDateFilter();
    });

    $scope.formatDateFilter = function () {
      if ($scope.search.startDate && $scope.search.endDate) {
        $scope.startDateFilter = dateUtility.formatDate($scope.search.startDate,
          'L',
          'YYYY-MM-DD');
        $scope.endDateFilter = dateUtility.formatDate($scope.search.endDate,
          'L',
          'YYYY-MM-DD');
      }
    };

    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;

    $scope.pageCount = function () {
      return Math.ceil($scope.items.length / $scope.itemsPerPage);
    };

    // Get a list of items
    itemsFactory.getItemsList({}).then(function (response) {

      $scope.items = response.retailItems;

      $scope.totalItems = response.meta.count;

      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;

      // update the paginated items to display
      $scope.paginatedItems = $scope.items.slice(begin, end);

      itemsFactory.getItemTypesList().then(function (itemTypes) {
        $scope.itemTypes = itemTypes;
      });

      // get sales categories
      companiesFactory.getSalesCategoriesList(function (data) {
        $scope.salesCategories = data.salesCategories;
      });

      // hide loading modal
      angular.element('#loading').modal('hide');

      // when current page and items per page change
      $scope.$watch('currentPage + itemsPerPage', function () {

        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;

        // update the paginated items to display
        $scope.paginatedItems = $scope.items.slice(begin, end);

      });


    });

    $scope.removeItem = function (id, itemKey) {

      if (window.confirm('Are you sure you would like to remove this item?')) {

        angular.element('#loading').modal('show').find('p').text(
          'Removing your item');

        itemsFactory.removeItem(id).then(function () {

          angular.element('#loading').modal('hide');

          $scope.paginatedItems.splice(itemKey, 1);

        });

      }

    };

    $scope.isItemActive = function (startDate) {
      return Date.parse(startDate) <= dateUtility.now();
    };

    $scope.isItemInactive = function (endDate) {
      return Date.parse(endDate) <= dateUtility.now();
    };

    $scope.clearSearchFilters = function () {

      var filters = $scope.search;

      $scope.startDate = '';
      $scope.endDate = '';

      $scope.startDateFilter = '';
      $scope.endDateFilter = '';

      for (var filterKey in filters) {
        $scope.search[filterKey] = '';
      }

    };

  });
