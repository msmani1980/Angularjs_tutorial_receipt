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

    $scope.companyList = [];

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    }

    var attachCompanyListToScope = function (companyListFromAPI) {
      $scope.companyList = companyListFromAPI.companies;
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

    function setupController () {
      showLoadingModal('Loading Company List');
      companyFactory.getCompanyList().then(attachCompanyListToScope);
    }

    setupController();

  });
