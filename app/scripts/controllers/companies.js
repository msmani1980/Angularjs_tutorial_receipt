'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompaniesCtrl
 * @description
 * # CompaniesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompaniesCtrl', function ($scope, $http, $localStorage) {

    $scope.$storage = $localStorage;

    var url = 'https://ec2-52-6-49-188.compute-1.amazonaws.com';

    var req = {
        method: 'GET',
        url: url + '/api/companies',
        headers: {
            'Content-Type': 'application/json',
            'userId': 1
        }
    };

    $http(req).success(function(data) {

        // baseCurrencyCode: "GBP"
        // baseCurrencyId: 8
        // companyCode: "U2"
        // companyLanguages: "French (Standard),Spanish (Spain),German (Standard)"
        // companyName: "EasyJet"
        // companyTypeId: 1
        // companyTypeName: "Retail"
        // countRelation: "0"
        // dbaName: nulled
        // iName: null
        // exchangeRateVariance: null
        // id: 374
        // isActive: "true"
        // legalName: "EasyJet Airline Company Ltd"
        // parentCompanyId: null

        $scope.companies = data.companies;

        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;
        $scope.maxSize = 8;

        $scope.pageCount = function () {
          return Math.ceil($scope.companies.length / $scope.itemsPerPage);
        };

        // $scope.companies.$promise.then(function () {
          $scope.totalItems = $scope.companies.length;
          $scope.$watch('currentPage + itemsPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
            var end = begin + $scope.itemsPerPage;

            $scope.filteredCompanies = $scope.companies.slice(begin, end);
          });
        // });


    }).
    // TODO: error(function(data, status, headers, config) {
    error(function() {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });


  });
