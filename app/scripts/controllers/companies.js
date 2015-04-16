'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompaniesCtrl
 * @description
 * # CompaniesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompaniesCtrl', function ($scope, companiesListFactory, $localStorage, $location) {

    $scope.$storage = $localStorage;
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.maxSize = 8;
    // $scope.bigTotalItems = 175;
    // $scope.bigCurrentPage = 1;
    $scope.companies = companiesListFactory.getList();

    // Click Action
    $scope.showCompany = function(company) {
      $location.path('company/' + company.id);
    };

    $scope.pageCount = function () {
      return Math.ceil($scope.companies.length / $scope.itemsPerPage);
    };

    $scope.companies.$promise.then(function () {

      // Inside the return, get the 'companies' array
      var companiesArray = $scope.companies.companies;

      $scope.totalItems = companiesArray.length;
      $scope.$watch('currentPage + itemsPerPage', function() {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;

        $scope.filteredCompanies = companiesArray.slice(begin, end);
      });
    });

  });
