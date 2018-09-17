'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:UserCreateCtrl
 * @description
 * # UserCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('UserCreateCtrl', function ($scope, $compile, ENV, $resource, $location, $anchorScroll, dateUtility,
		    $routeParams, globalMenuService, $q, $filter, lodash, userManagementService) {
  $scope.formData = {
    userName: '',
	email: '',
    firstName: '',
    lastName: '',
    company: '',
    allowAllStations:false,
    eulaVersion: null,
    enabled: false,
	roles: [],
	companies: [],
	stations: []
  };
  
  $scope.viewName = 'Create User';
  $scope.buttonText = 'Create';
  $scope.userIsActive = false;
  $scope.userIsInactive = false;
  $scope.viewOnly = false;
  $scope.editingUser = false;
  var $this = this;

  this.showLoadingModal = function(text) {
    angular.element('#loading').modal('show').find('p').text(text);
  };

  this.hideLoadingModal = function() {
    angular.element('#loading').modal('hide');
  };

  this.errorHandler = function(dataFromAPI) {
    $this.hideLoadingModal();
    $scope.displayError = true;
    $scope.errorResponse = angular.copy(dataFromAPI);
  };

  this.checkFormState = function() {
    console.log ('$location.path', $location);  
	console.log ('$routeParams', $routeParams);  
    var path = $location.path();
    if (path.search('/user-edit') !== -1 && $routeParams.user) {
        $scope.editingUser = true;
        $scope.buttonText = 'Save';
        $scope.viewName = 'Editing User'+ $routeParams.user;
      } else if (path.search('/user-view') !== -1 && $routeParams.user) {
        $scope.viewOnly = true;
        $scope.viewName = 'Viewing User '+ $routeParams.user;
      }
  };

  this.getPromises = function() {
    var promises = [
      userManagementService.userByCode($routeParams.user)
    ];

    return promises;
  };

  this.getUserData = function() {
    $this.showLoadingModal('We are loading user data!');
    var promises = $this.getPromises();
    $q.all(promises).then($this.initSuccess, $this.errorHandler);
  };  

  this.initSuccess = function(response) {
	  
    console.log ('response', response);
    var userData = angular.copy(response[0]);
    console.log ('userData', userData);
    $this.hideLoadingModal();
    $this.initUI(userData);  
  };

  this.initUI = function(userData) {
    console.log ('initUI--->userData', userData);
    $scope.formData.userName = userData.userName;
    $scope.formData.email = userData.email;
    $scope.formData.firstName = userData.firstName;
    $scope.formData.lastName = userData.lastName;
    $scope.formData.company = getUserCompany (userData);
    $scope.formData.allowAllStations = userData.allowStations;
    $scope.formData.eulaVersion = userData.eulaVersion;
    $scope.formData.enabled = userData.enabled;
    //$scope.formData.roles = userData.,
    //$scope.formData.companies = userData.,
    //$scope.formData.stations = userData.;
  };

  function getUserCompany (userData) {
	  
  var company = '';
  if (angular.isDefined(userData.companiesView) && userData.companiesView !== null && userData.companiesView.length >0) {
    console.log ('getUserCompany--->userData.companiesView', userData.companiesView);
    var usrCmp = lodash.findWhere(userData.companiesView, {
      id: userData.companyId
    });

    console.log ('getUserCompany--->usrCmp', usrCmp);

    if (angular.isDefined(usrCmp.id) && angular.isDefined(usrCmp.companyCode) && angular.isDefined(usrCmp.companyName)) { 
      company = usrCmp.id +' ['+usrCmp.companyCode+'] '+usrCmp.companyName;
    }
  }
  return company
  }
/*
  $scope.formData = {
		    userName: '',
			email: '',
		    firstName: '',
		    lastName: '',
		    company: '',
		    allowAllStations:false,
		    eulaVersion: null,
		    enabled: false,
			roles: [],
			companies: [],
			stations: [],
		  };
*/
  this.init = function() {
    $this.getUserData();
    $this.checkFormState();
  };

  $this.init(); 
});
