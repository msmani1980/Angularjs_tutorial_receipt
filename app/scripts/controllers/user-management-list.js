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
		//$this.meta.count = $this.meta.count || userListFromAPI.meta.count;
	    //var userList = angular.copy(userListFromAPI.users);
	    //angular.forEach(userList, function(user) {
	    //  $scope.userList.push(user);
	    //});
	    $scope.userList = userListFromAPI;
	    
	    hideLoadingModal();
	  
	  };

	  $scope.viewUser = function(user) {
	    $location.path('/user-view/' + user.userName);
	  };

	  $scope.editUser = function(user) {
	    $location.path('/user-edit/' + user.userName);
	  };

	  function createSearchPayload() {
	    return {
	      field: $scope.search.field,
	      filter: $scope.search.filter
	    };
	  }

      this.getUserListSuccess = function(dataFromAPI) {
    	  
        console.log ('addUsersToList->dataFromAPI.length ', dataFromAPI.length );
        console.log ('addUsersToList->dataFromAPI', dataFromAPI);
        if (dataFromAPI !== null && dataFromAPI.length > 0) {
          $scope.userList = dataFromAPI;
        }
        
	    //var userList = angular.copy(dataFromAPI);
	    //angular.forEach(userList, function(user) {
	      
	    //  var updDate = dateUtility.formatDateForApp(user.updateDate);
	    //  user.updateDate = updDate; 
	    //  $scope.userList.push(user);
	    //});

  	    hideLoadingModal();

  	  };

  	  $scope.getUpdatedOn = function (user) {
  		return user.updateDate ?  dateUtility.formatTimestampForApp(user.updateDate) : '';
      };
	  
	  $scope.loadUsers = function() {
		var companyData = globalMenuService.getCompanyData();
        console.log ('$scope.loadUsers !!! companyData ', companyData);  
	    //if ($this.meta.offset >= $this.meta.count) {
	    //  return;
	    //}

	    //$scope.search.field = 'organizationId';
	    //$scope.search.filter = '96';

	    //var payload = angular.extend({}, {
	    //  limit: $this.meta.limit,
	    //  offset: $this.meta.offset
	    //}, createSearchPayload());
	    //var companyIds = [643,653,362];
	    var payload = $scope.companyIds;//[643,653,362];
	    showLoadingModal();

	    console.log ('controller getUserList', payload);  

	    userManagementFactory.getUserList(payload).then($this.getUserListSuccess);
	    
	    //$this.meta.offset += $this.meta.limit;
	  };
/*
	  $scope.searchUsers = function() {
        console.log ('$scope.searchUsers');  
		  
	    $this.meta = {
	      limit: 100,
	      offset: 0
	    };
	    $scope.userList = [];
	    $scope.loadUsers();
	  };
*/
	  //function setCompanyTypes(dataFromAPI) {
	  //  $scope.companyTypeList = angular.copy(dataFromAPI);
	  //}
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
/*
	  $scope.clearForm = function() {
	  
		  $scope.search = {
	  	      field: null,
		      filter: null,
	    };
	  };
*/
});
