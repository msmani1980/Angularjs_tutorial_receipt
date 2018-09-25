'use strict';

/**
 * @ngdoc service
 * @name ts5App.userManagementService
 * @description
 * # userManagementService
 * Service in the ts5App.
 */
angular.module('ts5App').service('userManagementService', function ($resource, ENV) {
  
  var usersURL = ENV.apiUrl + '/IdentityAccess/users';
  var userByCodeURL = ENV.apiUrl + '/IdentityAccess/authorizeUser/:user';
  var organizationsURL = ENV.apiUrl + '/IdentityAccess/company/organizations';
  var userUpdateURL = ENV.apiUrl + '/IdentityAccess/updateUser';
  var userCreateURL = ENV.apiUrl + '/IdentityAccess/createUser';
  var userByIdURL = ENV.apiUrl + '/IdentityAccess/user/:id';
  var allRolesURL = ENV.apiUrl + '/IdentityAccess/allRoles';
  var userRolesURL = ENV.apiUrl + '/IdentityAccess/portaluserroles/:id';
  var updateUserRolesURL = ENV.apiUrl + '/IdentityAccess/managePortalUserRole/:userId';
  
  var organizationsParameters = {};
  var userUpdateParameters = {};
  var userCreateParameters = {};
  var allRolesParameters = {};

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
    },
    getOrganizations: {
      method: 'GET',
      isArray: true,        
      headers: {
        'Content-Type': 'application/json'
      }
    },
    getUserCompanies: {
      method: 'GET',
      isArray: true,        
      headers: {
        'Content-Type': 'application/json'
      }
    },
    updateUser: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    createUser: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    userById: {
      method: 'GET',       
      headers: {
        'Content-Type': 'application/json'
      }
    },
    getAllRoles: {
      method: 'GET',
      isArray: true,        
      headers: {
        'Content-Type': 'application/json'
      }
    },
    getUserRoles: {
      method: 'GET',   
      isArray: true,
      headers: {
        'Content-Type': 'application/json'
      }
    },
    updateUserRoles: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    }    
  };

  var organizationsResource = $resource(organizationsURL, organizationsParameters, actions);
  var allRolesResource = $resource(allRolesURL, allRolesParameters, actions);

  var userList = function(payload) {
    var parameters = {
      companyIds: payload
    };

    var usersResource = $resource(usersURL, parameters, actions);
    return usersResource.users().$promise;
  };

  var userByCode = function(user) {
    var parameters = {
      user: user
    };
  
    var userByCodeResource = $resource(userByCodeURL, parameters, actions);
    return userByCodeResource.authorizeUser().$promise;
  };

  var userById = function(id) {
    var parameters = {
      id: id
    };

    var userByIdResource = $resource(userByIdURL, parameters, actions);
    return userByIdResource.userById().$promise;
  };

  var getUserRoles = function(id) {
    var parameters = {
      id: id
    };

    var userRolesResource = $resource(userRolesURL, parameters, actions);
    return userRolesResource.getUserRoles().$promise;
  };

  var updateUserRoles = function(payload, userId) {
    var parameters = {
      userId: userId
    };

    var updateUserResource = $resource(updateUserRolesURL, parameters, actions);
    return updateUserResource.updateUserRoles(payload).$promise;
  };

  var getOrganizations = function() {
    return organizationsResource.getOrganizations().$promise;
  };

  var updateUser = function (person) {
    var userUpdateResource = $resource(userUpdateURL, userUpdateParameters, actions);
    return userUpdateResource.updateUser(person).$promise;
  };

  var createUser = function (person) {
    var userCreateResource = $resource(userCreateURL, userCreateParameters, actions);
    return userCreateResource.createUser(person).$promise;
  };

  var getAllRoles = function() {
    return allRolesResource.getAllRoles().$promise;
  };

  return {
    userList:userList,
    userByCode:userByCode,
    getOrganizations:getOrganizations,
    updateUser:updateUser,
    createUser:createUser,
    userById:userById,
    getAllRoles:getAllRoles,
    getUserRoles:getUserRoles,
    updateUserRoles:updateUserRoles
  };
  
});
