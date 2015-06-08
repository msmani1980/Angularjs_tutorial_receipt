'use strict';
/*global moment*/
/**
 * @author Max Felker <max@bigroomstudios.com>
 * @ngdoc function
 * @name ts5App.controller:ItemListCtrl
 * @description
 * # ItemsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
    .controller('ItemListCtrl', function ($scope,$http,itemsFactory,companiesFactory) {

      // TODO: Move to global function
      function formatDate(dateString, formatFrom, formatTo) {
        return moment(dateString, formatFrom).format(formatTo).toString();
      }

      // set search and start dates to nothing
      $scope.search = {
        startDate: '',
        endDate: ''
      };

      $scope.startDateFilter = '';
      $scope.endDateFilter = '';

      var todaysDate = moment().format();

      $scope.$watch('search.startDate + search.endDate', function(){

        $scope.formatDateFilter();

      });

      $scope.formatDateFilter = function() {

        if ($scope.search.startDate.length){
          $scope.startDateFilter = formatDate($scope.search.startDate,'L', 'YYYY-MM-DD');
          $scope.endDateFilter = formatDate($scope.search.endDate,'L', 'YYYY-MM-DD');
        }

      };

      // display loading modal
      //angular.element('#loading').modal('show').find('p').text('Getting a list of items for you');

      $scope.currentPage = 1;
      $scope.itemsPerPage = 10;

      $scope.pageCount = function () {
        return Math.ceil($scope.items.length / $scope.itemsPerPage);
      };

      // Get a list of items
      itemsFactory.getItemsList({}).then(function (response) {

          var items = response.retailItems;

          $scope.totalItems = response.meta.count;

          var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
          var end = begin + $scope.itemsPerPage;

          // update the paginated items to display
          $scope.paginatedItems = items.slice(begin, end);

          itemsFactory.getItemTypesList().then(function(itemTypes) {
              $scope.itemTypes = itemTypes;
          });

          // get sales categories
          companiesFactory.getSalesCategoriesList(function(data) {
            $scope.salesCategories = data.salesCategories;
          });

          // hide loading modal
          angular.element('#loading').modal('hide');

          // when current page and items per page change
          $scope.$watch('currentPage + itemsPerPage', function() {

            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            // update the paginated items to display
            $scope.paginatedItems = items.slice(begin, end);

          });


      });

      $scope.removeItem = function(id,itemKey) {

        if( window.confirm('Are you sure you would like to remove this item?') ) {

          angular.element('#loading').modal('show').find('p').text('Removing your item');

          itemsFactory.removeItem(id).then(function () {

            angular.element('#loading').modal('hide');

            $scope.paginatedItems.splice(itemKey,1);

          });

        }

      };

      $scope.isItemActive = function(startDate) {

        startDate = formatDate(startDate, 'YYYYMMDD', 'L');

        return moment( startDate ).isBefore( todaysDate ) ;

      };

      $scope.isItemInactive = function(endDate) {

        endDate = formatDate(endDate, 'YYYYMMDD', 'L');

        return moment( endDate ).isBefore( todaysDate );

      };

      $scope.clearSearchFilters = function() {

       var filters = $scope.search;

       $scope.startDate = '';
       $scope.endDate = '';

       $scope.startDateFilter = '';
       $scope.endDateFilter = '';

       for(var filterKey in filters) {
         $scope.search[filterKey] = '';
       }

     };

    });
