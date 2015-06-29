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
    $scope.isLoading = true;
    $scope.companyRelationshipListData = [];
    $scope.company = {};
    $scope.companyList = [];
    $scope.companyRelationshipTypeList = [];

    $scope.addCompanyRelationship = function (id) {
      $scope.companyRelationshipListData.push({
        companyId: id,
        relativeCompanyId: null,
        startDate: null,
        endDate: null
      });
    };

    function saveCompanyRelationship(typeOfSave) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Company Relationship</strong>: successfully ' + typeOfSave + '!'
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
      if (!isValid) {
        return;
      }

      var promises = [];
      data.forEach(function (companyRelationship) {
        var messageAction = companyRelationship.id ? 'updated' : 'created';
        promises.push(companyRelationshipFactory.updateCompanyRelationship(companyRelationship).then(saveCompanyRelationship(messageAction)));
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
        $scope.companyRelationshipListData = companyRelationshipsFromAPI.filter(function (companyRelationship) {
          return (companyRelationship.companyId === $scope.company.id) ? companyRelationship : undefined;
        });
      }
    }

    function setupCompanyScope(companyListFromAPI) {
      $scope.companyList = companyListFromAPI.companies.filter(function (company) {
        if (company.id === parseInt($routeParams.id)) {
          $scope.company = company;
          return undefined;
        } else {
          return company;
        }
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

    var getCompanyRelationshipListByCompanyPromise = function (companyId) {
      return companyRelationshipFactory.getCompanyRelationshipListByCompany(companyId);
    };
    var getCompanyListPromise = function () {
      return companyRelationshipFactory.getCompanyList();
    };
    var getCompanyRelationshipTypeListPromise = function (companyTypeId) {
      return companyRelationshipFactory.getCompanyRelationshipTypeList(companyTypeId);
    };

    getCompanyListPromise().then(function (response) {
      setupCompanyScope(response);

      return $q.all([getCompanyRelationshipListByCompanyPromise($routeParams.id), getCompanyRelationshipTypeListPromise($scope.company.companyTypeId)]);
    }).then(function (response) {
      setupCompanyRelationshipScope(response[0]);
      setupCompanyRelationshipTypeScope(response[1]);
      filterCompanyListByTypesScope(response[1]);
    }).then(function () {
      $scope.isLoading = false;
    })
  });