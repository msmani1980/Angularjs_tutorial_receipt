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

    this.filterItems = function() {
      return $filter('filter')($scope.itemsList, $scope.search);
    };

    this.generateItemQuery = function() {
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

    this.getItemsList = function() {
      var query = this.generateItemQuery();
      var $this = this;
      itemsFactory.getItemsList(query).then(function (response) {
        $scope.itemsList = response.retailItems;
        //console.log($filter($scope.itemsList, {}))
        $this.hideLoadingModal();
      });
    };

    this.getItemTypesList = function() {
      itemsFactory.getItemTypesList().then(function (itemTypes) {
        $scope.itemTypes = itemTypes;
      });
    };

    this.getSalesCategoriesList = function() {
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
      itemsFactory.removeItem(itemId).then(function() {
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

    $scope.clearSearchFilters = function() {
      $scope.dateRange.startDate = '';
      $scope.dateRange.endDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        delete $scope.search[filterKey];
      }
      $this.displayLoadingModal();
      $this.getItemsList();
    };

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    $scope.searchRecords = function() {
      $this.displayLoadingModal();
      $this.getItemsList();
    };

    this.getItemsList();
    this.getItemTypesList();
    this.getSalesCategoriesList();

  });
