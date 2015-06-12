'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyRelationshipListCtrl
 * @description
 * # CompanyRelationshipListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyRelationshipListCtrl', function ($scope, $routeParams, companyRelationshipFactory) {
    $scope.viewName = 'Company Relationships';
    $scope.companyRelationshipList = [];
    $scope.companyRelationshipTypeList = [];

    function setupCompanyRelationshipType(companyRelationshipTypeListFromAPI) {
      $scope.companyRelationshipTypeList = companyRelationshipTypeListFromAPI.response;
    }

    function setupCompanyRelationshipModel(companyRelationshipsFromAPI) {
      companyRelationshipsFromAPI = companyRelationshipsFromAPI.companyRelationships;
      if (!companyRelationshipsFromAPI.length) {
        $scope.companyRelationshipList.push({
          relativeCompanyId: null,
          startDate: null,
          endDate: null
        });
      } else {
        $scope.companyRelationshipList = angular.copy(companyRelationshipsFromAPI);
      }
    }

    companyRelationshipFactory.getCompany($routeParams.id).then(function(company) {
      return company;
    }).then(function(company) {
      $scope.company = company;
      companyRelationshipFactory.getCompanyRelationshipTypeList(company.companyTypeId).then(setupCompanyRelationshipType);
    });

    companyRelationshipFactory.getCompanyRelationshipListByCompany($routeParams.id).then(setupCompanyRelationshipModel, null).then(function() {

    });
  });