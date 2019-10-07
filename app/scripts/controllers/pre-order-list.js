'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PreOrderListCtrl
 * @description
 * # PreOrderListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PreOrderListCtrl', function ($scope, $q, $location, dateUtility, lodash, messageService, accessService, preOrdersFactory,
                                            stationsFactory, categoryFactory, currencyFactory) {
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.viewName = 'Pre-Orders';
    $scope.search = {};
    $scope.preOrders = [];
    $scope.loadingBarVisible = false;
    $scope.isSearch = false;

    function showLoadingBar() {
      $scope.loadingBarVisible = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $scope.loadingBarVisible = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    $scope.clearSearchForm = function() {
      $scope.isSearch = false;
      $scope.search = {};
      $scope.preOrders = [];
    };

    this.getPreOrderListSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.preOrders = $scope.preOrders.concat(response.preOrders.map(function (preOrder) {
        preOrder.orderDate = dateUtility.formatDateForApp(preOrder.orderDate);
        return preOrder;
      }));

      hideLoadingBar();
    };

    this.constructStartDate = function () {
      return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    $scope.loadPreOrderList = function() {
      /*jshint maxcomplexity:8 */
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();
      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        orderDate: $this.constructStartDate(),
        sortOn: 'orderDate',
        sortBy: 'ASC'
      });

      payload.orderDateFrom = (payload.orderDateFrom) ? dateUtility.formatDateForAPI(payload.orderDateFrom) : null;
      payload.orderDateTo = (payload.orderDateTo) ? dateUtility.formatDateForAPI(payload.orderDateTo) : null;
      payload.flightDateFrom = (payload.flightDateFrom) ? dateUtility.formatDateForAPI(payload.flightDateFrom) : null;
      payload.flightDateTo = (payload.flightDateTo) ? dateUtility.formatDateForAPI(payload.flightDateTo) : null;
      payload.departureStation = (payload.departureStation) ? payload.departureStation.code : null;
      payload.arrivalStation = (payload.arrivalStation) ? payload.arrivalStation.code : null;

      preOrdersFactory.getPreOrderList(payload).then($this.getPreOrderListSuccess);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchPreOrderData = function() {
      $scope.preOrders = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0,
        sortOn: 'orderDate',
        sortBy: 'ASC'
      };

      $scope.isSearch = true;
      $scope.loadPreOrderList();
    };

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    $scope.redirectToPreOrder = function(id, state) {
      $location.search({});
      $location.path('pre-orders/' + state + '/' + id).search();
    };

    $scope.isValidForRuleApply = function(preOrder) {
      if (angular.isUndefined(preOrder)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker(preOrder.startDate);
    };

    $scope.isPreOrderEditable = function(preOrder) {
      if (angular.isUndefined(preOrder)) {
        return false;
      }

      return dateUtility.isAfterOrEqualDatePicker(preOrder.endDate, dateUtility.nowFormattedDatePicker());
    };

    this.getStations = function () {
      return stationsFactory.getStationList(0).then($this.setStations);
    };

    this.setStations = function (dataFromAPI) {
      $scope.stationList = angular.copy(dataFromAPI.response);
    };

    this.getItemCategories = function () {
      return categoryFactory.getCategoryList({
        expand: true,
        sortBy: 'ASC',
        sortOn: 'orderBy',
        parentId: 0
      }).then($this.setItemCategories);
    };

    this.setItemCategories = function (dataFromAPI) {
      $scope.itemCategoryList = [];

      // Flat out category list
      dataFromAPI.salesCategories.forEach(function (category) {
        $this.flatCategoryList(category, $scope.itemCategoryList);
      });

      // Assign order for flatten category list and create helper dictionary
      var count = 1;
      $scope.itemCategoryList.forEach(function (category) {
        category.orderBy = count++;
      });
    };

    this.flatCategoryList = function (category, categories) {
      categories.push(category);

      category.children.forEach(function (category) {
        $this.flatCategoryList(category, categories);
      });
    };

    this.getCurrenciesList = function() {
      return currencyFactory.getCompanyGlobalCurrencies().then($this.setCurrenciesList);
    };

    this.setCurrenciesList = function(dataFromAPI) {
      $scope.currencyList = dataFromAPI.response;
    };

    this.initSuccessHandler = function() {
      angular.element('#search-collapse').addClass('collapse');
    };

    this.makeInitPromises = function() {
      var promises = [
        $this.getStations(),
        $this.getItemCategories(),
        $this.getCurrenciesList()
      ];
      return promises;
    };

    this.init = function() {
      var initDependencies = $this.makeInitPromises();
      $scope.isCRUD = accessService.crudAccessGranted('PREORDER', 'PREORDER', 'CRUDST');
      $q.all(initDependencies).then($this.initSuccessHandler);
    };

    this.init();

  });
