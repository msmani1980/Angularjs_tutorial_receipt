'use strict';
/*global $:false */

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyRelationshipListCtrl
 * @description
 * # CompanyRelationshipListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyRelationshipListCtrl', function ($q, $scope, $route, $location, $routeParams, ngToast, dateUtility, companyRelationshipFactory) {
    var $this = this;
    $scope.viewName = 'Company Relationships';
    $scope.isLoading = true;
    $scope.isRejected = false;
    $scope.companyRelationshipListData = [];
    $scope.company = {};
    $scope.companyList = [];
    $scope.companyRelationshipTypeList = [];

    $scope.back = function () {
      $location.path('/company-list/');
    };

    function showToast(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    this.parseDate = function (date) {
      return Date.parse(date);
    };

    $scope.isActive = function (startDate) {
      var parsedDate = $this.parseDate(startDate);
      return parsedDate <= dateUtility.now();
    };

    $scope.isInactive = function (endDate) {
      var parsedDate = $this.parseDate(endDate);
      return parsedDate <= dateUtility.now();
    };

    $scope.addCompanyRelationship = function (company) {
      $scope.companyRelationshipListData.unshift({
        companyId: company.id,
        companyName: company.companyName,
        relativeCompanyId: null,
        startDate: '',
        endDate: '',
        isEditing: true
      });
    };

    $scope.showDeleteConfirmation = function (companyRelationship) {
      $scope.companyRelationshipToDelete = companyRelationship;
      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteCompanyRelationship = function () {
      angular.element('.delete-warning-modal').modal('hide');

      companyRelationshipFactory.deleteCompanyRelationship($scope.companyRelationshipToDelete).then(function (response) {
        var index = $scope.companyRelationshipListData.indexOf($scope.companyRelationshipToDelete);
        var messageAction = 'deleted';

        successCompanyRelationship(response, $scope.companyRelationshipToDelete, messageAction);

        if (index > -1) {
          $scope.companyRelationshipListData.splice(index, 1);
        }
      }, function (error) {
        failCompanyRelationship(error, $scope.companyRelationshipToDelete);
      });
    };

    $scope.editCompanyRelationship = function (company) {
      company.original = angular.copy(company);
      company.isEditing = true;
    };
    
    $scope.cancelCompanyRelationship = function (company) {
      if (company.id) {
        company.isEditing = false;

        for (var prop in company.original) {
          company[prop] = company.original[prop];
        }
        return;
      }
      removeCompanyFromLocalList(company);
    };

    function removeCompanyFromLocalList(company) {
      var index = $scope.companyRelationshipListData.indexOf(company);

      if (index > -1) {
        $scope.companyRelationshipListData.splice(index, 1);
      }
    }

    function successCompanyRelationship(response, companyRelationship, messageAction) {
      if (!companyRelationship.id) {
        $route.reload();
      }
      companyRelationship.isEditing = false;

      showToast('success', 'Company Relationship', 'Successfully ' + messageAction);
    }

    function failCompanyRelationship(error/*, companyRelationship*/) {
      showToast('warning', 'Company Relationship', 'Error submitting ' + error.companyName + '!');
      $scope.displayError = true;
      $scope.formErrors = error.data;
    }

    $scope.submit = function (isValid, companyRelationship) {
      if (!isValid) {
        return;
      }

      if (!!companyRelationship.id) {
        companyRelationshipFactory.updateCompanyRelationship(companyRelationship).then(function (response) {
          var messageAction = companyRelationship.id ? 'updated' : 'created';

          successCompanyRelationship(response, companyRelationship, messageAction);
        }, function (error) {
          failCompanyRelationship(error, companyRelationship);
        });
      } else {
        companyRelationshipFactory.createCompanyRelationship(companyRelationship).then(function (response) {
          var messageAction = companyRelationship.id ? 'updated' : 'created';

          successCompanyRelationship(response, companyRelationship, messageAction);
        }, function (error) {
          failCompanyRelationship(error, companyRelationship);
        });
      }
    };

    function setupCompanyRelationshipTypeScope(companyRelationshipTypeListFromAPI) {
      $scope.companyRelationshipTypeList = companyRelationshipTypeListFromAPI.response;
    }

    function setupCompanyRelationshipScope(companyRelationshipsFromAPI) {
      companyRelationshipsFromAPI = companyRelationshipsFromAPI.companyRelationships;
      if (!companyRelationshipsFromAPI.length) {
        $scope.addCompanyRelationship($scope.company);
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
        company.isEditing = false;
        return ($.inArray(company.companyTypeId, typeIdList)) ? company : undefined;
      });
    }

    var getCompanyRelationshipListByCompanyPromise = function (companyId) {
      return companyRelationshipFactory.getCompanyRelationshipListByCompany(companyId);
    };

    var getCompanyListPromise = function () {
      return companyRelationshipFactory.getCompanyList();
    };

    var generateCompanyRelationshipPromises = function () {
      return [getCompanyRelationshipListByCompanyPromise($routeParams.id), getCompanyRelationshipTypeListPromise($scope.company.companyTypeId)];
    };

    var getCompanyListSuccessHandler = function (response) {
      setupCompanyScope(response);
      var promises = generateCompanyRelationshipPromises();
      return $q.all(promises);
    };

    var errorHandler = function (/*error*/) {
      $scope.isLoading = false;
      $scope.isRejected = true;
      showToast('warning', $scope.viewName, 'API unavailable');
      return;
    };

    var getCompanyRelationshipTypeListPromise = function (companyTypeId) {
      return companyRelationshipFactory.getCompanyRelationshipTypeList(companyTypeId);
    };

    var getCompanyRelationshipListByCompanyAndTypeSuccessHandler = function (response) {
      if (!response) {
        return;
      }
      setupCompanyRelationshipScope(response[0]);
      setupCompanyRelationshipTypeScope(response[1]);
      filterCompanyListByTypesScope(response[1]);
      $scope.isLoading = false;
    };

    var setupController = function () {
      getCompanyListPromise()
        .then(getCompanyListSuccessHandler, errorHandler)
        .then(getCompanyRelationshipListByCompanyAndTypeSuccessHandler, errorHandler);
    };

    setupController();
  });