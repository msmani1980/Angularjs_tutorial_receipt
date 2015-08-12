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
    var $this = this;
    this.offset = 0;
    $scope.viewName = 'Manage Companies';
    $scope.companyList = [];

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    }

    var appendCompaniesToList = function(companyListFromAPI) {
      var companyList = angular.copy(companyListFromAPI.companies);
      angular.forEach(companyList, function(company){
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

    $scope.loadCompanies = function(){
      showLoadingModal('Loading Company List');
      companyFactory.getCompanyList({limit:50, offset:$this.offset}).then(appendCompaniesToList);
      $this.offset += 50;
    };

  });
