'use strict';
/*global moment*/
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
    $scope.itemsList = null;

    var todaysDate = moment().format();

    // TODO: Move to global function
    function formatDate(dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
    }


    // TODO: Set a watch on this
    $scope.formatDateFilter = function () {

      $scope.startDateFilter = formatDate($scope.search.startDate, 'L',
        'YYYYMMDD');
      $scope.endDateFilter = formatDate($scope.search.endDate, 'L',
        'YYYYMMDD');

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
      startDate = formatDate(startDate, 'YYYYMMDD', 'L');
      return moment(startDate).isBefore(todaysDate);
    };

    $scope.isItemInactive = function (endDate) {
      endDate = formatDate(endDate, 'YYYYMMDD', 'L');
      return moment(endDate).isBefore(todaysDate);
    };

    $scope.clearSearchFilters = function () {
      var filters = $scope.search;
      for (var filterKey in filters) {
        $scope.search[filterKey] = '';
      }
    };

  });
