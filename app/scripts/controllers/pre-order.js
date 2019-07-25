'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PreOrderCtrl
 * @description
 * # PreOrderCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PreOrderCtrl', function ($scope, $q, $location, dateUtility, $routeParams, preOrdersFactory, lodash) {
    var $this = this;

    $scope.viewName = 'Pre-Order';
    $scope.preOrder = {};

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.preOrderSuccess = function(dataFromAPI) {
      var response = angular.copy(dataFromAPI);

      response.flightData.forEach(function (flightData) {
        flightData.flightDate = dateUtility.formatDateForApp(flightData.flightDate);
        flightData.totalItems = lodash.sum(flightData.itemData.map(function (item) { return item.qtyOrdered } ))
        flightData.totalPrice = lodash.sum(flightData.itemData.map(function (item) { return item.itemPrice } ))
      });

      $scope.preOrder = response;
    };

    this.initDependenciesSuccess = function() {
      if ($routeParams.id) {
        preOrdersFactory.getPreOrderById($routeParams.id).then($this.preOrderSuccess);
      } else {
        $scope.isLoadingCompleted = true;
      }

      $this.hideLoadingModal();
    };

    this.makeInitPromises = function() {
      var promises = [
      ];

      return promises;
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');

      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    $this.init();
  });
