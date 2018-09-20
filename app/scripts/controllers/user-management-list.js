'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:UserManagementListCtrl
 * @description
 * # UserManagementListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('UserManagementListCtrl', function($scope, $location, accessService, userManagementFactory, dateUtility, globalMenuService, identityAccessService) {
	
  var $this = this;
 /*
	  this.meta = {
	    limit: 100,
	    offset: 0
	  };
	  $scope.search = {
        field:null,
        filter: null
	  };
      */
  $scope.viewName = 'User Management';
  $scope.userList = [];
  $scope.companyIds = [];
	  
  function showLoadingModal() {
    angular.element('.loading-more').show();
  }

  function hideLoadingModal() {
    angular.element('.loading-more').hide();
    angular.element('.modal-backdrop').remove();
  }

  $this.appendUsersToList = function(userListFromAPI) {
    console.log ('appendUsersToList->userListFromAPI', userListFromAPI);
    $scope.userList = userListFromAPI;
    hideLoadingModal();
  };

  $scope.viewUser = function(user) {
    $location.path('/user-view/' + user.id);
  };

  $scope.editUser = function(user) {
    $location.path('/user-edit/' + user.id);
  };

  this.getUserListSuccess = function(dataFromAPI) {
    if (dataFromAPI !== null && dataFromAPI.length > 0) {
      $scope.userList = dataFromAPI;
    }
    hideLoadingModal();
  };

  $scope.getUpdatedOn = function (user) {
    return user.updateDate ?  dateUtility.formatTimestampForApp(user.updateDate) : '';
  };
  	  
  $scope.getExpiredDate = function (user) {
    return user.expiredDate ?  dateUtility.formatTimestampForApp(user.expiredDate) : '';
  };
    		  
  $scope.loadUsers = function() {
    var companyData = globalMenuService.getCompanyData();
    console.log ('$scope.loadUsers !!! companyData ', companyData);  
	var payload = $scope.companyIds;//[643,653,362];
	showLoadingModal();
	console.log ('controller getUserList', payload);  
	userManagementFactory.getUserList(payload).then($this.getUserListSuccess);
  };

  this.initSuccess = function(dataFromAPI) {
    console.log('initSuccess', dataFromAPI);
    if (angular.isDefined(dataFromAPI.companies)) {
      angular.forEach(dataFromAPI.companies, function(company) {
        $scope.companyIds.push(company.id);
      });
    }
    console.log('initSuccess->companyIds', $scope.companyIds);
    $scope.loadUsers ();
  };
      
  this.init = function() {
    console.log ('init user management controller');  
	$scope.isCRUD = accessService.crudAccessGranted('USERMANAGEMENT', 'USERMANAGEMENT', 'USRM');
	console.log ('init $scope.isCRUD', $scope.isCRUD);
	    identityAccessService.getUserCompanies().then($this.initSuccess);

  };

  this.init();
});
