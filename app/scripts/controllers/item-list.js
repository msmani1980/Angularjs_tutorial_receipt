'use strict';
/* global moment */

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
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    $scope.itemsList = [];
    $scope.dateRange = {
      startDate: '',
      endDate: ''
    };
    $scope.openVersionId = -1;

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    this.filterItems = function () {
      return $filter('filter')($scope.itemsList, $scope.search);
    };

    this.generateItemQuery = function () {
      var query = {
        sortBy: 'ASC',
        sortOn: 'itemName',
        limit: $this.meta.limit,
        offset: $this.meta.offset
      };

      angular.extend(query, $scope.search);

      if ($scope.search === {} || !$scope.search) {
        query.startDate = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
      }
      if ($scope.dateRange.startDate && $scope.dateRange.endDate) {
        query.startDate = dateUtility.formatDateForAPI($scope.dateRange
          .startDate);
        query.endDate = dateUtility.formatDateForAPI($scope.dateRange
          .endDate);
      }
      return query;
    };

    this.createNestedItemsList = function (itemList) {
      var newItemList = [];
      var currentMasterId = -1;
      angular.forEach(itemList, function (item) {
        if (item.itemMasterId === currentMasterId) {
          var lastIndex = newItemList.length - 1;
          newItemList[lastIndex].versions.push(item);
        } else {
          var newItem = {versions: [item], itemMasterId: item.itemMasterId};
          newItemList.push(newItem);
          currentMasterId = item.itemMasterId;
        }
      });
      angular.forEach(newItemList, function (item) {
        item.versions.sort($this.sortItemVersions);
      });
      return newItemList;
    };

    this.appendItemsToList = function (itemListFromAPI) {
      $this.meta.count = $this.meta.count || itemListFromAPI.meta.count;
      var itemList = angular.copy(itemListFromAPI.retailItems);
      var nestedItemList = $this.createNestedItemsList(itemList);
      $scope.itemsList = $scope.itemsList.concat(nestedItemList);
      hideLoadingBar();
    };

    function getItemsList() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }
      showLoadingBar();
      var query = $this.generateItemQuery();
      itemsFactory.getItemsList(query).then($this.appendItemsToList);
      $this.meta.offset += $this.meta.limit;
    }

    $scope.loadItems = function () {
      getItemsList();
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

    this.sortItemVersions = function (itemA, itemB) {
      if (itemA.startDate === itemB.startDate && itemA.endDate === itemB.endDate) {
        return 0;
      }
      if ($this.isItemActive(itemA)) {
        return -1;
      } else if ($this.isItemActive(itemB)) {
        return 1;
      }
      return $this.compareInactiveDates(itemA, itemB);
    };

    this.compareInactiveDates = function (itemA, itemB) {
      if ((dateUtility.isAfterToday(itemA.startDate) && dateUtility.isAfterToday(itemB.startDate)) ||
        (dateUtility.isYesterdayOrEarlier(itemA.endDate) && dateUtility.isYesterdayOrEarlier(itemB.endDate))) {
        return $this.sortByDateCloserToToday(itemA.startDate, itemB.startDate);
      } else {
        return $this.sortByDateFarthestInFuture(itemA.startDate, itemB.startDate);
      }
    };

    this.sortByDateCloserToToday = function (dateA, dateB) {
      var today = moment();
      var diffA = moment(dateA, 'YYYY-MM-DD').diff(today, 'days');
      var diffB = moment(dateB, 'YYYY-MM-DD').diff(today, 'days');
      return (Math.abs(diffA) < Math.abs(diffB)) ? -1 : 1;
    };

    this.sortByDateFarthestInFuture = function (dateA, dateB) {
      return moment(dateB, 'YYYY-MM-DD').diff(moment(dateA, 'YYYY-MM-DD'), 'days');
    };

    $scope.removeRecord = function (itemId) {
      $this.displayLoadingModal('Removing Retail Item');
      $this.closeAccordian();

      itemsFactory.removeItem(itemId).then(function () {
        $this.hideLoadingModal();
        getItemsList();
      });
    };

    this.parseDate = function (date) {
      return Date.parse(date);
    };

    this.isItemActive = function (item) {
      return (dateUtility.isTodayOrEarlier(item.startDate) && dateUtility.isAfterToday(item.endDate));
    };

    $scope.isDateActive = function (date) {
      return dateUtility.isTodayOrEarlier(date);
    };

    $scope.doesActiveOrFutureVersionExist = function (item) {
      var validVersionExists = false;
      angular.forEach(item.versions, function (version) {
        if(!dateUtility.isYesterdayOrEarlier(version.endDate)) {
          validVersionExists = true;
        }
      });
      return validVersionExists;
    };

    $scope.searchRecords = function () {
      this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.itemsList = [];
      getItemsList();
    };

    $scope.clearSearchFilters = function () {
      $scope.dateRange.startDate = '';
      $scope.dateRange.endDate = '';
      var filters = $scope.search;
      for (var filterKey in filters) {
        delete $scope.search[filterKey];
      }

      $scope.searchRecords();
    };

    $scope.hasSubVersions = function (item) {
      return (item.versions.length > 1);
    };

    $scope.isOpen = function (item) {
      return (item.itemMasterId === $scope.openVersionId);
    };

    $scope.toggleVersionVisibility = function (item) {
      if (!$scope.hasSubVersions(item)) {
        return;
      }
      if ($scope.openVersionId === item.itemMasterId) {
        $this.closeAccordian();
      } else {
        $this.openAccordian(item);
        $this.closeAccordian();
        $scope.openVersionId = item.itemMasterId;
      }
    };

    this.openAccordian = function (item) {
      angular.element('#item-' + item.itemMasterId).addClass('open-accordion');
    };
    this.closeAccordian = function () {
      angular.element('#item-' + $scope.openVersionId).removeClass('open-accordion');
      $scope.openVersionId = -1;

    };

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.getItemTypesList();
    this.getSalesCategoriesList();


  });
