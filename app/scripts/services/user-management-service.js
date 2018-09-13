'use strict';

/**
 * @ngdoc service
 * @name ts5App.userManagementService
 * @description
 * # userManagementService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('userManagementService', function ($resource, ENV) {
  
  var usersURL = ENV.apiUrl + '/IdentityAccess/users';

  var actions = {
    users: {
	  method: 'GET',
	  isArray: true,        
	  headers: {
	    'Content-Type': 'application/json'
	  }
    }
  };
  
  var userList = function(payload) {
    console.log ('userManagementService->payload', payload);	
    var parameters = {
      companyIds: payload
    };

    var usersResource = $resource(usersURL, parameters, actions);
    return usersResource.users().$promise;
  };

    return {
    	userList:userList
    };
  
});
