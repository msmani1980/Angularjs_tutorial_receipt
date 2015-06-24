'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyRelationshipListCtrl
 * @description
 * # CompanyRelationshipListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyRelationshipListCtrl', function ($q, $scope, $location, $routeParams, ngToast, companyRelationshipFactory) {
    $scope.viewName = 'Company Relationships';
    $scope.formData = [];
    $scope.company = {};
    $scope.companyList = [];
    $scope.companyRelationshipTypeList = [];

    $scope.addCompanyRelationship = function () {
      $scope.formData.push({
        companyId: $scope.company.id,
        relativeCompanyId: null,
        startDate: null,
        endDate: null
      });
    };

    function updateCompanyRelationship(response) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Company Relationship</strong>: successfully updated!'
      });
      //$scope.displayError = false;
      //$scope.formErrors = {};
    }

    function createCompanyRelationship() {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Company Relationship</strong>: successfully created!'
      });
      //$scope.displayError = false;
      //$scope.formErrors = {};
    }

    function submitCompanyRelationshipError(error) {
      var company = $scope.companyList.filter(function (company) {
        return company.id === parseInt(error.config.data.relativeCompanyId)
      });
      ngToast.create({
        className: 'warning',
        dismissButton: true,
        content: '<strong>Company Relationship</strong>: Error creating ' + company[0].companyName + '!'
      });
      $scope.displayError = true;
      $scope.formErrors = error.data;
    }

    $scope.submit = function(isValid, data) {
      if(!isValid) return;

      var promises = [];
      data.forEach(function (companyRelationship) {
        if (companyRelationship.id) {
          promises.push(companyRelationshipFactory.updateCompanyRelationship(companyRelationship).then(updateCompanyRelationship))//, updateCompanyRelationshipError));
        } else {
          promises.push(companyRelationshipFactory.createCompanyRelationship(companyRelationship).then(createCompanyRelationship))//, createCompanyRelationshipError));
        }
      });

      $q.all(promises).then(function () {
        $location.path('/company-list/');
        }, submitCompanyRelationshipError
      )
    };

    $scope.cancel = function () {
      $location.path('/company-list/');
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