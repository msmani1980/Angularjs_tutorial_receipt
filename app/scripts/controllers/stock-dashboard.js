'use strict';
/* global $*/
/**
 * @ngdoc function
 * @name ts5App.controller:StockDashboardCtrl
 * @description
 * # StockDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockDashboardCtrl', function ($scope) {

    $scope.viewName = 'Stock Dashboard';
    $scope.search = {};
    
    $('[data-toggle=popover]').popover({
        placement : 'top',
        html : true,
        title: function() {
            var title = $(this).attr('data-popover-content');
            return $(title).children('.popover-heading').html();
        },
    	content: function() {
          var content = $(this).attr('data-popover-content');
          return $(content).children('.popover-body').html();
        }
    });
    $('[data-toggle=popover]').on('click', '.popover .close' , function(){
        $(this).popover('hide');
    });
    
  });
