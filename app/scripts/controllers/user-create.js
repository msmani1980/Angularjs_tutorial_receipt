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
	id:null,	  
    oldUserName: '',
    userName: '',
	email: '',
    firstName: '',
    lastName: '',
    company: '',
    organizationId:'',
    allowAllStations:false,
    eulaVersion: null,
    enabled: false,
    expiredDate: '',
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
  $scope.creatingUser = false;
  $scope.displayError = false;
  $scope.organizations = [];
  
  $scope.allRolesList = [];
  $scope.adminLevelRolesList=[];
  $scope.userLevelRolesList=[];
  $scope.egateLevelRolesList=[];
  
  $scope.userRolesList = [];
  $scope.selectedRoles = [];
  
  var $this = this;

  $scope.getClassForAccordionArrows = function (accordionFlag) {
    return (accordionFlag) ? 'fa-chevron-down' : 'fa-chevron-right';
  };

  this.showLoadingModal = function(text) {
    angular.element('#loading').modal('show').find('p').text(text);
  };

  this.hideLoadingModal = function() {
    angular.element('#loading').modal('hide');
  };

  this.errorHandler = function(dataFromAPI) {
    console.log ('errorHandler--->dataFromAPI', dataFromAPI);
    $this.hideLoadingModal();
    if (angular.isDefined(dataFromAPI.data) && dataFromAPI.data !==null && dataFromAPI.data !== '') {
      showCustomError('', dataFromAPI.data);
    } else {
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    }  
  };

  function showCustomError(errorField, errorMessage) {
    $scope.errorCustom = [{ field: errorField, value: errorMessage }];
    $scope.displayError = true;
  }

  this.validateForm = function() {
    $scope.displayError = !$scope.form.$valid;
    return $scope.form.$valid;
  };

  this.submitFormSuccess = function(response) {
    angular.element('#loading').modal('hide');
    angular.element('#update-success').modal('show');
  };

  $scope.roleSelectionToggled = function () {
    console.log ('BEFORE ---------------> roleSelectionToggled--->selectedRoles', $scope.selectedRoles);
    $scope.selectedRoles = [];
    lodash.forEach($scope.allRolesList, function (role) {
        if (role.selected) {
        	$scope.selectedRoles.push(role);
        }
    });
    console.log ('AFTER ---------------> roleSelectionToggled--->selectedRoles', $scope.selectedRoles);
  };

  $scope.toggleAllCheckboxes = function () {
	$scope.allCheckboxesSelected = $scope.allCheckboxesSelected?false:true;
    console.log ('toggleAllCheckboxes->$scope.allCheckboxesSelected', $scope.allCheckboxesSelected);
    console.log ('BEFORE----->toggleAllCheckboxes--->$scope.allRolesList', $scope.allRolesList);
	//var roles = [];  
    angular.forEach($scope.allRolesList, function (role) {
        role.selected = $scope.allCheckboxesSelected;
        //roles.push(role);
    });

    //console.log ('AFTER----->toggleAllCheckboxes--->roles', $scope.allRolesList);
    //$scope.allRolesList = roles; 
    console.log ('AFTER----->toggleAllCheckboxes--->$scope.allRolesList', $scope.allRolesList);
    $scope.roleSelectionToggled();
  };

  $scope.submitForm = function(formData) {
    console.log ('submitForm--->formData', formData);
    $scope.form.$setSubmitted(true);
    if (formData && $this.validateForm()) {
      var userData = angular.copy(formData);
      var expiredDate = ((userData.expiredDate==='' || userData.expiredDate===null) ? '' : dateUtility.formatDateForAPI(userData.expiredDate, null, 'YYYY-MM-DD'));
    
      var person = {
        id: userData.id, 
        userName: userData.userName,
        allowStations: userData.allowAllStations, 
        enabled: userData.enabled, 
        organizationId: userData.organization.id, 
        expired: expiredDate,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName
      }

    
      if ($scope.editingUser) {
        console.log ('UPDATE USER--->payload', person);
        userManagementService.updateUser(person).then($this.submitFormSuccess, $this.errorHandler);
      }

      if ($scope.creatingUser) {
        console.log ('CREATE USER--->payload', person);
        userManagementService.createUser(person).then($this.submitFormSuccess, $this.errorHandler);
      }
    }
  };

  this.checkFormState = function() {
    console.log ('$location.path', $location);  
	console.log ('$routeParams', $routeParams);  
    var path = $location.path();
    if (path.search('/user-edit') !== -1 && $routeParams.user) {
        $scope.editingUser = true;
        $scope.buttonText = 'Save';
        $scope.viewName = 'Editing User '+ $scope.formData.userName;
      } else if (path.search('/user-view') !== -1 && $routeParams.user) {
        $scope.viewOnly = true;
        $scope.viewName = 'Viewing User '+ $scope.formData.userName;
      } else if (path.search('/user-create') !== -1) {
          $scope.creatingUser = true;
      }

  };

  this.getPromises = function() {
    var promises = [
      userManagementService.userById($routeParams.user),
      userManagementService.getOrganizations(),
      userManagementService.getAllRoles(),
      userManagementService.getUserRoles($routeParams.user)
    ];

    return promises;
  };

  this.getDependenciesPromises = function() {
    var promises = [
	  userManagementService.getOrganizations(),
	  userManagementService.getAllRoles()
	];

	return promises;
  };

  this.getUserData = function() {
    $this.showLoadingModal('We are loading user data!');
    
    var path = $location.path();
    if (path.search('/user-create') !== -1) {
      $scope.creatingUser = true;
    }
    console.log ('$routeParams', $routeParams);
    console.log ('$scope.creatingUser', $scope.creatingUser);
    
    if ($scope.creatingUser) {
      var dependenciesPromises = $this.getDependenciesPromises();
        $q.all(dependenciesPromises).then($this.initDependenciesSuccess, $this.errorHandler);
    }
    else {
      var promises = $this.getPromises();
      $q.all(promises).then($this.initSuccess, $this.errorHandler);
    }
  };  
  
  this.initDependenciesSuccess = function(response) {
	  
    console.log ('response', response);
    var organizationList = angular.copy(response[0]);
    angular.forEach(organizationList, function (organztn) {
	  var organization = {id:organztn.id, name:organztn.name};
	  $scope.organizations.push(organization);
	});

	console.log ('$scope.organizations', $scope.organizations);
    $this.hideLoadingModal();
  };

  this.initSuccess = function(response) {
	  
    console.log ('response', response);
    $this.hideLoadingModal();

    var userData = angular.copy(response[0]);

    $this.initOrganizations(angular.copy(response[1]));
    $this.initUserRoles (angular.copy(response[3]));
    
    $this.initUI(userData);  
  };

  this.initOrganizations = function (organizationList) {
    angular.forEach(organizationList, function (organztn) {
	  var organization = {id:organztn.id, name:organztn.name};
	  $scope.organizations.push(organization);
	});
	console.log ('$scope.organizations', $scope.organizations);
  };

  this.initUserRoles = function (rolesDataList) {
    var isAdminRole = false;
    var isUserRole = false
    var isEgateRole = false
    angular.forEach(rolesDataList, function (roleData) {
	  var role = {
        id:roleData.id,
		selected:roleData.false,
		admin:roleData.admin,
		roleName:roleData.roleName,
		selected:true
	  }
	  if (!roleData.admin) {
	    if(roleData.roleName.endsWith ('Admin')) {
		  isAdminRole = true;	
		  $scope.adminLevelRolesList.push(role);
		}
	    if(roleData.roleName.endsWith ('User')) {
		  isUserRole = true;	
		  $scope.userLevelRolesList.push(role);
		}
	  }else {
		$scope.egateLevelRolesList.push(role);
		isEgateRole = true;
		$scope.rolesListType = 'egate';
		$scope.allRolesList = $scope.egateLevelRolesList;
	  }

    });
    console.log ('$scope.allRolesList', $scope.allRolesList);
    console.log ('$scope.egateLevelRolesList', $scope.egateLevelRolesList);
  };
  
  this.initUI = function(userData) {
    console.log ('initUI--->userData', userData);
    $scope.formData.id = userData.id;
    $scope.formData.userName = userData.userName;
    $scope.formData.oldUserName = userData.userName;
    $scope.formData.email = userData.email;
    $scope.formData.firstName = userData.firstName;
    $scope.formData.lastName = userData.lastName;
    $scope.formData.company = getUserCompany (userData);
    $scope.formData.organizationId = userData.organizationId;
    $scope.formData.organization = getUserOrganization (userData.organizationId);
    $scope.formData.allowAllStations = userData.allowStations;
    $scope.formData.eulaVersion = userData.eulaVersion;
    $scope.formData.enabled = userData.enabled;
    $scope.formData.expiredDate = ((userData.expired==='' || userData.expired===null) ? '' : dateUtility.formatDateForApp(userData.expired));

    //$scope.formData.roles = userData.,
    //$scope.formData.companies = userData.,
    //$scope.formData.stations = userData.;
    
    console.log ('initUI--->$scope.formData', $scope.formData);
  };
  
  function getUserOrganization (organizationId) {
    var usrOrg = lodash.findWhere($scope.organizations, {
	  id: organizationId
	});

	console.log ('getUserOrganization', usrOrg);
    return usrOrg;
  }

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
  return company;
  }
  
  this.init = function() {
    $scope.allCheckboxesSelected = false;
    $this.getUserData();
    $this.checkFormState();
  };

  $this.init(); 
  
  
});
