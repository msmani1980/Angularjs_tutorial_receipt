'use strict';
/* global moment */
/**
 * @author Max Felker <max@bigroomstudios.com>
 * @ngdoc function
 * @name ts5App.controller:StockOwnerItemListCtrl
 * @description
 * # ItemsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockOwnerItemListCtrl', function ($scope, $http, itemsFactory,
    companiesFactory) {

    $scope.search = {
      startDate: '',
      endDate: ''
    };
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.startDateFilter = '';
    $scope.endDateFilter = '';
    $scope.itemsList = [];
    $scope.startDateFilter = '';
    $scope.endDateFilter = '';

    var todaysDate = Date.parse(new Date());

    // TODO: Move to global function
    function formatDate(dateString, formatFrom, formatTo) {
      var dateToReturn = moment(dateString, formatFrom).format(formatTo).toString();
      return dateToReturn;
    }

    $scope.$watch('search.startDate + search.endDate', function () {
      $scope.formatDateFilter();
    });

    $scope.formatDateFilter = function () {

      if ($scope.search.startDate && $scope.search.endDate) {
        $scope.startDateFilter = formatDate($scope.search.startDate, 'L',
          'YYYY-MM-DD');
        $scope.endDateFilter = formatDate($scope.search.endDate, 'L',
          'YYYY-MM-DD');
      }

    };

    this.setPaginatedList = function () {
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.paginatedItems = $scope.itemsList.slice(begin, end);
    };

    this.getItemsList = function () {
      var $this = this;
      itemsFactory.getItemsList({}).then(function (response) {
        $scope.itemsList = response.retailItems;
        $scope.totalItems = response.meta.count;
        $this.setPaginatedList();
        $scope.$watch('currentPage + itemsPerPage', function () {
          $this.setPaginatedList();
        });
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

    this.getItemsList();
    this.getItemTypesList();
    this.getSalesCategoriesList();

    $scope.pageCount = function () {
      return Math.ceil($scope.items.length / $scope.itemsPerPage);
    };

    $scope.removeItem = function (itemToDelete) {

      angular.element('#loading').modal('show').find('p').text(
        'Removing your item');

      itemsFactory.removeItem(itemToDelete.id).then(function () {

        angular.element('#loading').modal('hide');

        $scope.paginatedItems.splice(itemToDelete.itemKey, 1);

      });

    };

    $scope.isItemActive = function (startDate) {
      return Date.parse(startDate) <= todaysDate;
    };

    $scope.isItemInactive = function (endDate) {
      return Date.parse(endDate) <= todaysDate;
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
