'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyListCtrl
 * @description
 * # CompanyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyListCtrl', function ($scope, companyFactory, $location) {
    $scope.viewName = 'Manage Companies';
    $scope.isLoading = true;
    $scope.isRejected = false;

    $scope.companyList = [];
    $scope.filteredCompanyList = [];
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;

    var $this = this;

    $scope.pageCount = function () {
      return Math.ceil($scope.companyList.length / $scope.itemsPerPage);
    };

    this.updateItemList = function() {
      $scope.itemsListCount = $scope.companyList.length;
      $this.setPaginatedItems($scope.companyList);
    };

    this.setPaginatedItems = function(filteredItems) {
      this.parsePaginationToInt();
      var begin = (($scope.currentPageInt - 1) * $scope.itemsPerPageInt);
      var end = begin + $scope.itemsPerPageInt;
      $scope.filteredCompanyList = filteredItems.slice(begin, end);
    };

    this.parsePaginationToInt = function() {
      $scope.currentPageInt = parseInt($scope.currentPage);
      $scope.itemsPerPageInt = parseInt($scope.itemsPerPage);
    };

    var attachCompanyListToScope = function (companyListFromAPI) {
      $scope.companyList = companyListFromAPI.companies;

      $scope.isLoading = false;

      $scope.$watchGroup(['currentPage', 'itemsPerPage'], function () {
        $this.updateItemList();
      });
    };

    $scope.showCompanyRelationshipList = function (company) {
      $location.path('/company-relationship-list/' + company.id);
    };

    $scope.viewCompany = function (company) {
      //$location.path('/company-view/' + company.id);
      window.location = 'ember/#/companies/' + company.id + '/view';
    };

    $scope.createCompany = function () {
      window.location = 'ember/#/companies/create';
    };

    $scope.editCompany = function (company) {
      //$location.path('/company-edit/' + company.id);
      window.location = 'ember/#/companies/' + company.id + '/edit';
    };

    function setupController () {
      companyFactory.getCompanyList().then(attachCompanyListToScope);
    }

    setupController();

  });