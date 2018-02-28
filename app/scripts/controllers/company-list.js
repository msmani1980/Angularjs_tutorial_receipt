'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyListCtrl
 * @description
 * # CompanyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('CompanyListCtrl', function($scope, companyFactory, $location, accessService) {
  var $this = this;
  this.meta = {
    limit: 100,
    offset: 0
  };
  $scope.search = {
    companyCode: null,
    companyName: null,
    companyTypeId: null
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

  $this.appendCompaniesToList = function(companyListFromAPI) {
    $this.meta.count = $this.meta.count || companyListFromAPI.meta.count;
    var companyList = angular.copy(companyListFromAPI.companies);
    angular.forEach(companyList, function(company) {
      $scope.companyList.push(company);
    });

    hideLoadingModal();
  };

  $scope.showCompanyRelationshipList = function(company) {
    $location.path('/company-relationship-list/' + company.id);
  };

  $scope.viewCompany = function(company) {
    $location.path('/company-view/' + company.id);
  };

  $scope.editCompany = function(company) {
    $location.path('/company-edit/' + company.id);
  };

  function createSearchPayload() {
    return {
      companyCode: $scope.search.companyCode,
      companyName: $scope.search.companyName,
      companyTypeId: $scope.search.companyTypeId
    };
  }

  $scope.loadCompanies = function() {
    if ($this.meta.offset >= $this.meta.count) {
      return;
    }

    var payload = angular.extend({}, {
      limit: $this.meta.limit,
      offset: $this.meta.offset
    }, createSearchPayload());
    showLoadingModal();
    companyFactory.getCompanyList(payload).then($this.appendCompaniesToList);
    $this.meta.offset += $this.meta.limit;
  };

  $scope.searchCompanies = function() {
    $this.meta = {
      limit: 100,
      offset: 0
    };
    $scope.companyList = [];
    $scope.loadCompanies();
  };

  function setCompanyTypes(dataFromAPI) {
    $scope.companyTypeList = angular.copy(dataFromAPI);
  }
  
  this.init = function() {
    $scope.isCRUD = accessService.crudAccessGranted('COMPANY', 'COMPANY', 'CRUDCMP');
    companyFactory.getCompanyTypes().then(setCompanyTypes);
  };

  this.init();

  $scope.clearForm = function() {
    $scope.search = {
      companyCode: null,
      companyName: null,
      companyTypeId: null
    };
  };

});
