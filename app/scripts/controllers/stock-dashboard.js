'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StockDashboardCtrl
 * @description
 * # StockDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockDashboardCtrl', function($scope, $http, stockDashboardService, catererStationService) {

    $scope.viewName = 'Stock Dashboard';
    $scope.search = {};

    angular.element('[data-toggle=popover]').popover({
      placement: 'top',
      html: true,
      title: function() {
        var title = angular.element(this).attr('data-popover-content');
        return angular.element(title).children('.popover-heading').html();
      },
      content: function() {
        var content = angular.element(this).attr('data-popover-content');
        return angular.element(content).children('.popover-body').html();
      }
    });

    angular.element('[data-toggle=popover]').on('click', '.popover .close', function() {
      angular.element(this).popover('hide');
    });

    this.getStockDashboardItemsSuccessHandler = function(dataFromAPI) {
      $scope.stockDashboardItemsList = dataFromAPI.response;
    };

    this.getCatererStationListSuccessHandler = function(dataFromAPI) {
      console.log(dataFromAPI);
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.init = function() {
      stockDashboardService.getStockDashboardItems().then(this.getStockDashboardItemsSuccessHandler);
      catererStationService.getCatererStationList().then(this.getCatererStationListSuccessHandler);
    };

    this.init();

  });
