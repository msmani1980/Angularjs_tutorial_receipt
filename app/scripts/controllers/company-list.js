'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyListCtrl
 * @description
 * # CompanyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyListCtrl', function ($scope, companyFactory, $localStorage, $location) {
    $scope.viewName = 'Manage Companies';

    $scope.$storage = $localStorage;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.maxSize = 8;

    $scope.pageCount = function () {
      return Math.ceil($scope.companyList.length / $scope.itemsPerPage);
    };

    var attachCompanyListToScope = function (companyListFromAPI) {
      $scope.companyList = companyListFromAPI.companies;
      $scope.totalItems = $scope.companyList.length;

      $scope.$watch('currentPage + itemsPerPage', function () {
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;

        $scope.filteredCompanies = $scope.companyList.slice(begin, end);
      });
    };

    $scope.showCompanyRelationshipList = function (company) {
      $location.path('/company-relationship-list/' + company.id);
    };

    $scope.showCompany = function (company) {
      $location.path('/company-view/' + company.id);
    };

    $scope.editCompany = function (company) {
      $location.path('/company-edit/' + company.id);
    };

    companyFactory.getCompanyList().then(attachCompanyListToScope);

  });