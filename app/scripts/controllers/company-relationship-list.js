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

    $scope.addCompanyRelationship = function (id) {
      $scope.formData.push({
        companyId: id,
        relativeCompanyId: null,
        startDate: null,
        endDate: null
      });
    };

    function updateCompanyRelationship() {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Company Relationship</strong>: successfully updated!'
      });
    }

    function createCompanyRelationship() {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Company Relationship</strong>: successfully created!'
      });
    }

    function submitCompanyRelationshipError(error) {
      var company = $scope.companyList.filter(function (company) {
        return company.id === parseInt(error.config.data.relativeCompanyId)
      });
      ngToast.create({
        className: 'warning',
        dismissButton: true,
        content: '<strong>Company Relationship</strong>: Error submitting ' + company[0].companyName + '!'
      });
      $scope.displayError = true;
      $scope.formErrors = error.data;
    }

    $scope.submit = function(isValid, data) {
      if(!isValid) return;

      var promises = [];
      data.forEach(function (companyRelationship) {
        if (companyRelationship.id) {
          promises.push(companyRelationshipFactory.updateCompanyRelationship(companyRelationship).then(updateCompanyRelationship));
        } else {
          promises.push(companyRelationshipFactory.createCompanyRelationship(companyRelationship).then(createCompanyRelationship));
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

    function setupCompanyRelationshipTypeScope(companyRelationshipTypeListFromAPI) {
      $scope.companyRelationshipTypeList = companyRelationshipTypeListFromAPI.response;
    }

    function setupCompanyRelationshipScope(companyRelationshipsFromAPI) {
      companyRelationshipsFromAPI = companyRelationshipsFromAPI.companyRelationships;
      if (!companyRelationshipsFromAPI.length) {
        $scope.addCompanyRelationship($routeParams.id);
      } else {
        $scope.formData = companyRelationshipsFromAPI;
      }
    }

    function setupCompanyScope(companyListFromAPI) {
      $scope.companyList = companyListFromAPI.companies.filter(function (company) {
        if (company.id === parseInt($routeParams.id)) {
          $scope.company = company;
          return undefined;
        }
        return company;
      });
    }

    function filterCompanyListByTypesScope(companyTypeListFromAPI) {
      var typeIdList = [];

      companyTypeListFromAPI.response.filter(function (type) {
        typeIdList.push(type.companyTypeId);
      });

      $scope.companyList = $scope.companyList.filter(function (company) {
        return ($.inArray(company.companyTypeId, typeIdList)) ? company : undefined;
      });
    }

    var getCompanyRelationshipListByCompanyPromise = companyRelationshipFactory.getCompanyRelationshipListByCompany($routeParams.id);
    var getCompanyListPromise = companyRelationshipFactory.getCompanyList();

    $q.all([getCompanyRelationshipListByCompanyPromise, getCompanyListPromise]).then(function (response) {
      setupCompanyRelationshipScope(response[0]);
      setupCompanyScope(response[1]);

      return companyRelationshipFactory.getCompanyRelationshipTypeList($scope.company.companyTypeId);
    }).then(function (types) {
      setupCompanyRelationshipTypeScope(types);
      filterCompanyListByTypesScope(types);
    })
  });