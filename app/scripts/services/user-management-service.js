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
  var userByCodeURL = ENV.apiUrl + '/IdentityAccess/authorizeUser/:user';

  var actions = {
    users: {
	  method: 'GET',
	  isArray: true,        
	  headers: {
	    'Content-Type': 'application/json'
	  }
    },
    authorizeUser: {
  	  method: 'GET',       
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

  var userByCode= function(user) {
    console.log ('userManagementService->userByUserName', user);	
	var parameters = {
      user: user
	};

	var userByCodeResource = $resource(userByCodeURL, parameters, actions);
	return userByCodeResource.authorizeUser().$promise;
  };


/*  
    var sendEmail = function(shouldRecoverUser, emailContent, emailAddress, username) {
      var URLtoSend = (shouldRecoverUser) ? sendUsernameRecoveryEmail : sendPasswordRecoveryEmail;
      sendEmailParameters = {
        email: emailAddress
      };

      if (!shouldRecoverUser) {
        sendEmailParameters.username = (!!username) ? username : '';
      }

      var sendEmailResource = $resource(URLtoSend, sendEmailParameters, actions);
      return sendEmailResource.sendEmail(emailContent).$promise;
    };
  
*/  
    return {
    	userList:userList,
    	userByCode:userByCode
    };
  
});
