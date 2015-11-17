'use strict';

/**
 * @ngdoc service
 * @name ts5App.identityAccessService
 * @description
 * # identityAccessService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('identityAccessService', function ($resource, ENV) {
    var authorizeURL = ENV.apiUrl + '/IdentityAccess/authorizeUser';
    var chpwdURL = ENV.apiUrl + '/IdentityAccess/chpwd';
    var logoutURL = ENV.apiUrl + '/IdentityAccess/logout';
    var featuresInRoleURL = ENV.apiUrl + '/IdentityAccess/featuresInRole';

    var authParameters = {};
    var chpwdParameters = {};
    var logoutParameters = {};
    var featuresInRoleParameters = {};

    var actions = {
      authorizeUser: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      changePassword: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      checkAuth: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      featuresInRole: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      logout: {
        method: 'PUT'
      }
    };

    var authResource = $resource(authorizeURL, authParameters, actions);
    var chpwdResource = $resource(chpwdURL, chpwdParameters, actions);
    var logoutResource = $resource(logoutURL, logoutParameters, actions);
    var featuresInRoleResource = $resource(featuresInRoleURL, featuresInRoleParameters, actions);

    var authorizeUser = function (payload) {
      return authResource.authorizeUser(payload).$promise;
    };

    var changePassword = function (payload) {
      return chpwdResource.changePassword(payload).$promise;
    };

    var checkAuth = function (payload) {
      return authResource.checkAuth(payload).$promise;
    };

    var featuresInRole = function (payload) {
      return featuresInRoleResource.featuresInRole(payload).$promise;
    };

    var logout = function (payload) {
      return logoutResource.logout(payload).$promise;
    };

    return {
      authorizeUser: authorizeUser,
      checkAuth: checkAuth,
      changePassword: changePassword,
      featuresInRole: featuresInRole,
      logout: logout
    };
  });
