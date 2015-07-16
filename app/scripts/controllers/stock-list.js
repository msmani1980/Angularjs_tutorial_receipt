'use strict';
/* global $*/
/**
 * @ngdoc function
 * @name ts5App.controller:StockListCtrl
 * @description
 * # StockListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockListCtrl', function ($scope) {
    var _companyId = '403',
      _services = null;

    $scope.viewName = 'Stock Management';
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
