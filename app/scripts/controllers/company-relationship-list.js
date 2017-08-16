'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyRelationshipListCtrl
 * @description
 * # CompanyRelationshipListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyRelationshipListCtrl', function($q, $scope, $route, $location, $routeParams, $filter,
    messageService, dateUtility, companyRelationshipFactory) {

    $scope.viewName = 'Company Relationships';
    $scope.isLoading = true;

    $scope.companyRelationshipListData = [];
    $scope.company = {};
    $scope.companyList = [];
    $scope.companyRelationshipTypeList = [];

    $scope.back = function() {
      $location.path('/company-list/');
    };

    $scope.isPending = function() {
      return $scope.isLoading;
    };

    $scope.isFulfilled = function() {
      return !$scope.isLoading;
    };

    function showToast(className, type, message) {
      messageService.display(className, message, type);
    }

    this.parseDate = function(date) {
      return Date.parse(date);
    };

    function errorHandler(dataFromAPI) {
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    }

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

    $scope.isActive = function(date) {
      return (dateUtility.isTodayOrEarlierDatePicker(date.startDate) && (dateUtility.isAfterTodayDatePicker(date.endDate) || dateUtility.isTodayDatePicker(date.endDate)));
    };

    $scope.isInactive = $scope.isActive;

    $scope.addCompanyRelationship = function(company) {
      $scope.companyRelationshipListData.unshift({
        companyId: company.id,
        companyName: company.companyName,
        relativeCompanyId: null,
        startDate: '',
        endDate: '',
        isEditing: true
      });
    };

    $scope.showDeleteConfirmation = function(companyRelationship) {
      $scope.companyRelationshipToDelete = companyRelationship;
      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteCompanyRelationship = function() {
      angular.element('.delete-warning-modal').modal('hide');

      companyRelationshipFactory.deleteCompanyRelationship($scope.companyRelationshipToDelete).then(function(
        response) {
        var index = $scope.companyRelationshipListData.indexOf($scope.companyRelationshipToDelete);
        var messageAction = 'deleted';

        successCompanyRelationship(response, $scope.companyRelationshipToDelete, messageAction);

        if (index > -1) {
          $scope.companyRelationshipListData.splice(index, 1);
        }
      }, function(error) {

        errorHandler(error, $scope.companyRelationshipToDelete);
      });
    };

    $scope.editCompanyRelationship = function(company) {
      company.original = angular.copy(company);
      company.isEditing = true;
    };

    $scope.cancelCompanyRelationship = function(company) {
      if (company.id) {
        company.isEditing = false;

        for (var prop in company.original) {
          company[prop] = company.original[prop];
        }

        return;
      }

      removeCompanyFromLocalList(company);
    };

    $scope.submit = function(isValid, companyRelationship) {
      if (!isValid) {
        return;
      }

      if (!!companyRelationship.id) {
        companyRelationshipFactory.updateCompanyRelationship(companyRelationship).then(function(response) {
          var messageAction = companyRelationship.id ? 'updated' : 'created';

          successCompanyRelationship(response, companyRelationship, messageAction);
        }, function(error) {

          errorHandler(error, companyRelationship);
        });
      } else {
        companyRelationshipFactory.createCompanyRelationship(companyRelationship).then(function(response) {
          var messageAction = companyRelationship.id ? 'updated' : 'created';

          successCompanyRelationship(response, companyRelationship, messageAction);
        }, function(error) {

          errorHandler(error, companyRelationship);
        });
      }
    };

    function setupCompanyRelationshipTypeScope(companyRelationshipTypeListFromAPI) {
      $scope.companyRelationshipTypeList = [];
      angular.forEach(angular.copy(companyRelationshipTypeListFromAPI.response), function(relationshipType) {
        var newRelationshipType = {};
        newRelationshipType.companyTypeName = (relationshipType.companyTypeId === $scope.company.companyTypeId) ?
          relationshipType.relativeCompanyType : relationshipType.companyTypeName;
        newRelationshipType.companyTypeId = (relationshipType.companyTypeId === $scope.company.companyTypeId) ?
          relationshipType.relativeCompanyTypeId : relationshipType.companyTypeId;
        $scope.companyRelationshipTypeList.push(newRelationshipType);
      });
    }

    function setupCompanyRelationshipScope(companyRelationshipsFromAPI) {
      companyRelationshipsFromAPI = companyRelationshipsFromAPI.companyRelationships;
      if (!companyRelationshipsFromAPI.length) {
        $scope.addCompanyRelationship($scope.company);
      } else {
        $scope.companyRelationshipListData = companyRelationshipsFromAPI;
      }
    }

    function setupCompanyAndCompanyListScope(companyListFromAPI) {
      $scope.companyList = companyListFromAPI.companies.filter(function(company) {
        if (company.id === parseInt($routeParams.id)) {
          $scope.company = company;
          return undefined;
        } else {
          return company;
        }
      });
    }

    var filterCompanyListByTypesScope = function(companyTypeListFromAPI) {
      var typeIdList = [];
      companyTypeListFromAPI.response.forEach(function(companyType) {
        var companyTypeToUse = (companyType.companyTypeId === $scope.company.companyTypeId) ? companyType.relativeCompanyTypeId :
          companyType.companyTypeId;
        typeIdList.push(companyTypeToUse);
      });

      $scope.companyList = $scope.companyList.filter(function(company) {
        company.isEditing = false;
        return typeIdList.indexOf(company.companyTypeId) !== -1;
      });
    };

    var getCompanyRelationshipListByCompanyPromise = function(companyId) {
      return companyRelationshipFactory.getCompanyRelationshipListByCompany(companyId);
    };

    var getCompanyListPromise = function() {
      return companyRelationshipFactory.getCompanyList();
    };

    var getCompanyRelationshipTypeListPromise = function(companyTypeId) {
      return companyRelationshipFactory.getCompanyRelationshipTypeList(companyTypeId);
    };

    var generateCompanyRelationshipPromises = function() {
      return [getCompanyRelationshipListByCompanyPromise($routeParams.id), getCompanyRelationshipTypeListPromise(
        $scope.company.companyTypeId)];
    };

    var getCompanyListSuccessHandler = function(response) {
      setupCompanyAndCompanyListScope(response);
      var promises = generateCompanyRelationshipPromises();
      return $q.all(promises);
    };

    var getCompanyRelationshipListByCompanyAndTypeSuccessHandler = function(response) {
      if (!response) {
        return;
      }

      setupCompanyRelationshipScope(response[0]);
      setupCompanyRelationshipTypeScope(response[1]);
      filterCompanyListByTypesScope(response[1]);
      $scope.isLoading = false;
    };

    var setupController = function() {
      getCompanyListPromise()
        .then(getCompanyListSuccessHandler, errorHandler)
        .then(getCompanyRelationshipListByCompanyAndTypeSuccessHandler, errorHandler);
    };

    setupController();
    
    $scope.isCurrentEffectiveDate = function (date) {
      return (dateUtility.isTodayOrEarlierDatePicker(date.startDate) && (dateUtility.isAfterTodayDatePicker(date.endDate) || dateUtility.isTodayDatePicker(date.endDate)));
    };
    
    $scope.isFutureEffectiveDate = function (date) {
    	console.log(date.startDate+'================='+dateUtility.isAfterTodayDatePicker(date.startDate));
    	console.log(date.endDate+'================='+dateUtility.isAfterTodayDatePicker(date.endDate));
      return (dateUtility.isAfterTodayDatePicker(date.startDate) && (dateUtility.isAfterTodayDatePicker(date.endDate)));
    };
  });
