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
    $scope.formData = [];
    $scope.company = {};
    $scope.companyList = [];
    $scope.companyRelationshipTypeList = [];

    $scope.saveCompanyRelationshipList = function () {
      var payload = {};
      payload.companyRelationships = angular.copy($scope.formData);

      $scope.formData.forEach(function (companyRelationship) {
        if (companyRelationship.id) {
          companyRelationshipFactory.updateCompanyRelationship(companyRelationship);
        } else {
          companyRelationshipFactory.createCompanyRelationship(companyRelationship);
        }
      });
    };

    $scope.addCompanyRelationship = function () {
      $scope.formData.push({
        relativeCompanyId: null,
        startDate: null,
        endDate: null
      });
    };

    function setupCompanyRelationshipType(companyRelationshipTypeListFromAPI) {
      $scope.companyRelationshipTypeList = companyRelationshipTypeListFromAPI.response;
    }

    function setupCompanyRelationshipModel(companyRelationshipsFromAPI) {
      companyRelationshipsFromAPI = companyRelationshipsFromAPI.companyRelationships;
      if (!companyRelationshipsFromAPI.length) {
        $scope.addCompanyRelationship();
      } else {
        $scope.formData = companyRelationshipsFromAPI;
      }
    }

    companyRelationshipFactory.getCompanyList().then(function (companyListFromAPI) {
      return companyListFromAPI;
    }).then(function (companyListFromAPI) {
      $scope.companyList = companyListFromAPI.companies.filter(function (company) {
        if (company.id === parseInt($routeParams.id)) {
          $scope.company = company;
          return undefined;
        } else {
          return company;
        }
      });
      companyRelationshipFactory.getCompanyRelationshipTypeList($scope.company.companyTypeId).then(setupCompanyRelationshipType);
    });

    companyRelationshipFactory.getCompanyRelationshipListByCompany($routeParams.id).then(setupCompanyRelationshipModel);
  });