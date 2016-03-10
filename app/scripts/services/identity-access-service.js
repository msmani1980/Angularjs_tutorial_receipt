'use strict';

/**
 * @ngdoc service
 * @name ts5App.identityAccessService
 * @description
 * # identityAccessService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('identityAccessService', function($resource, ENV) {
    var authorizeURL = ENV.apiUrl + '/IdentityAccess/authorizeUser';
    var chpwdURL = ENV.apiUrl + '/IdentityAccess/chpwd';
    var sendUsernameRecoveryEmail = ENV.apiUrl + '/IdentityAccess/recoveruser/:email/send';
    var sendPasswordRecoveryEmail = ENV.apiUrl + '/IdentityAccess/recoverpassword/:email/:username/';
    var logoutURL = ENV.apiUrl + '/IdentityAccess/logout';
    var featuresInRoleURL = ENV.apiUrl + '/IdentityAccess/featuresInRole';
    var userCompaniesURL = ENV.apiUrl + '/IdentityAccess/company/alluserscompanies';

    // var eulaUrl = ENV.apiUrl + '/IdentityAccess/eula';

    var authParameters = {};
    var chpwdParameters = {};
    var sendEmailParameters = {};
    var logoutParameters = {};
    var featuresInRoleParameters = {};
    var userCompaniesParameters = {};

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
      sendEmail: {
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
      getUserCompanies: {
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
    var userCompaniesResource = $resource(userCompaniesURL, userCompaniesParameters, actions);

    var authorizeUser = function(payload) {
      return authResource.authorizeUser(payload).$promise;
    };

    var changePassword = function(payload, headers) {
      delete actions.changePassword.headers.sessionToken;
      if (headers) {
        actions.changePassword.headers.sessionToken = headers.sessionToken;
      }

      return chpwdResource.changePassword(payload).$promise;
    };

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

    var checkAuth = function(headers) {
      delete actions.checkAuth.headers.sessionToken;
      if (headers) {
        actions.checkAuth.headers.sessionToken = headers.sessionToken;
      }

      return authResource.checkAuth().$promise;
    };

    var featuresInRole = function(payload) {
      return featuresInRoleResource.featuresInRole(payload).$promise;
    };

    var getUserCompanies = function(payload) {
      return userCompaniesResource.getUserCompanies(payload).$promise;
    };

    var logout = function(payload) {
      return logoutResource.logout(payload).$promise;
    };

    return {
      authorizeUser: authorizeUser,
      checkAuth: checkAuth,
      changePassword: changePassword,
      sendEmail: sendEmail,
      featuresInRole: featuresInRole,
      getUserCompanies: getUserCompanies,
      logout: logout
    };
  });
