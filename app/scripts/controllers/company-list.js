'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyListCtrl
 * @description
 * # CompanyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('CompanyListCtrl', function ($scope, companyFactory, $location) {
  var $this = this;
  this.meta = {
    limit: 100,
    offset: 0
  };
  $scope.viewName = 'Manage Companies';
  $scope.companyList = [];

  function showLoadingModal() {
    angular.element('.loading-more').show();
  }

  function hideLoadingModal() {
    angular.element('.loading-more').hide();
    angular.element('.modal-backdrop').remove();
  }

  $this.appendCompaniesToList = function (companyListFromAPI) {
    $this.meta.count = $this.meta.count || companyListFromAPI.meta.count;
    var companyList = angular.copy(companyListFromAPI.companies);
    angular.forEach(companyList, function (company) {
      $scope.companyList.push(company);
    });
    hideLoadingModal();
  };

  $scope.showCompanyRelationshipList = function (company) {
    $location.path('/company-relationship-list/' + company.id);
  };

  $scope.viewCompany = function (company) {
    window.location = 'ember/#/companies/' + company.id + '/view';
  };

  $scope.editCompany = function (company) {
    window.location = 'ember/#/companies/' + company.id + '/edit';
  };

  $scope.loadCompanies = function () {
    if ($this.meta.offset >= $this.meta.count) {
      return;
    }
    showLoadingModal('Loading Company List');
    companyFactory.getCompanyList({
      limit: $this.meta.limit,
      offset: $this.meta.offset
    }).then($this.appendCompaniesToList);
    $this.meta.offset += $this.meta.limit;
  };

});
