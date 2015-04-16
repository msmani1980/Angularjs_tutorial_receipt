'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompaniesCtrl
 * @description
 * # CompaniesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompaniesCtrl', function ($scope, companiesListFactory, $localStorage) {

    $scope.$storage = $localStorage;

    $scope.companies = companiesListFactory.query();

    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.maxSize = 8;

    // $scope.bigTotalItems = 175;
    // $scope.bigCurrentPage = 1;

    $scope.pageCount = function () {
      return Math.ceil($scope.friends.length / $scope.itemsPerPage);
    };

    $scope.companies.$promise.then(function () {

      // Inside the return, get the 'companies' array
      $scope.companies = $scope.companies.companies;

      $scope.totalItems = $scope.companies.length;
      $scope.$watch('currentPage + itemsPerPage', function() {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;

        $scope.filteredCompanies = $scope.companies.slice(begin, end);
      });
    });

  });
