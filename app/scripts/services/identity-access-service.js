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
    var logoutURL = ENV.apiUrl + '/IdentityAccess/logout';

    var authParameters = {
    };
    var logoutParameters = {};

    var actions = {
      authorizeUser: {
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
      logout: {
        method: 'PUT'
      }
    };

    var authResource = $resource(authorizeURL, authParameters, actions);
    var logoutResource = $resource(logoutURL, logoutParameters, actions);

    var authorizeUser = function (payload) {
      return authResource.authorizeUser(payload).$promise;
    };

    var checkAuth = function (payload) {
      return authResource.checkAuth(payload).$promise;
    };

    var logout = function (payload) {
      return logoutResource.logout(payload).$promise;
    };

    return {
      authorizeUser: authorizeUser,
      checkAuth: checkAuth,
      logout: logout
    };
  });
