'use strict';
/*global CryptoJS*/

/**
 * @ngdoc service
 * @name ts5App.identityAccessFactory
 * @description
 * # identityAccessFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('identityAccessFactory', function (identityAccessService, $rootScope, $http, $localStorage, $location, $timeout, $window, companyFactory, $q, lodash) {
      function changePassword(credentials, sessionToken) {
        var payload = {
          username: credentials.username,
          password: CryptoJS.SHA256(credentials.username + credentials.password).toString(CryptoJS.enc.Base64)
        };
        return identityAccessService.changePassword(payload, sessionToken);

      }

      function sendEmail(emailAddress, emailContent) {
        return identityAccessService.sendEmail(emailAddress, emailContent);

      }

      function logoutFromSystem() {
        identityAccessService.logout();
      }

      function logout() {
        $window.localStorage.clear();
        delete $localStorage.sessionObject;
        delete $localStorage.companyObject;
        delete $localStorage.company;
        delete $http.defaults.headers.common.userId;
        delete $http.defaults.headers.common.companyId;
        delete $http.defaults.headers.common.sessionToken;
        $timeout(function () {
          $location.path('/login');
        });
      }

      function getSessionObject() {
        if ($localStorage.sessionObject) {
          return JSON.parse(CryptoJS.AES.decrypt($localStorage.sessionObject, 'aes@56').toString(CryptoJS.enc.Utf8));
        }

        return {};
      }

      function setSessionHeaders() {
        var sessionObject = angular.copy(getSessionObject());
        if (sessionObject.companyData) {
          $localStorage.companyObject = {
            companyId: sessionObject.companyId,
            companyTypeId: sessionObject.companyData.companyTypeId
          };
        }

        delete sessionObject.username;
        delete sessionObject.companyData;
        angular.extend($http.defaults.headers.common, sessionObject);
      }

      function encryptDataInLS(dataFromAPI) {
        var sessionObject = {
          userId: dataFromAPI.id,
          username: dataFromAPI.userName,
          companyId: dataFromAPI.companyId,
          companyData: dataFromAPI.companyData,
          userCompanies: dataFromAPI.userCompanies,
          sessionToken: dataFromAPI.currentSession.sessionToken,
          timeout: 60000
        };
        $localStorage.sessionObject = CryptoJS.AES.encrypt(JSON.stringify(sessionObject), 'aes@56').toString();
        setSessionHeaders();
      }

      function broadcastSuccess(companyData) {
        $rootScope.$broadcast('authorized');
        $rootScope.$broadcast('company-fetched', companyData);
      }

      function broadcastError(requestError) {
        var cleanError = angular.copy(requestError);
        $rootScope.$broadcast('un-authorized', cleanError);
      }

      function setSessionData(dataFromAPI) {
        encryptDataInLS(dataFromAPI);
        broadcastSuccess(dataFromAPI.companyData);
        $location.path('/');
      }

      function isAuthorized() {
        return !!(getSessionObject().sessionToken);
      }

      function isLocationValid(locationURL) {
        var allowedHashArray = ['login', 'change-password'];
        var allowedURLsArray = allowedHashArray.filter(function (url) {
          return locationURL.contains(url);
        });

        return allowedURLsArray.length > 0;
      }

      function locationChangeHandler(event, next) {
        if (!isAuthorized() && (!isLocationValid(next) && !next.contains('forgot'))) {
          event.preventDefault();
          logout();
        }
      }

      function getCompanyResponseHandler(dataFromAPI, rawSessionObject) {
        var sessionObject = angular.copy(rawSessionObject);
        sessionObject.companyData = angular.copy(dataFromAPI[0]);
        sessionObject.userCompanies = angular.copy(dataFromAPI[2].companies);
        sessionObject.companyData.companyTypeName = angular.copy(lodash.findWhere(dataFromAPI[1], { id: sessionObject.companyData.companyTypeId }).name);
        setSessionData(sessionObject);
      }

      function getCompanyData(rawSessionData) {
        var companyDataPromiseArray = [
          companyFactory.getCompany(rawSessionData.companyId),
          companyFactory.getCompanyTypes(),
          identityAccessService.getUserCompanies()
        ];

        $q.all(companyDataPromiseArray).then(function (dataFromApi) {
          getCompanyResponseHandler(dataFromApi, rawSessionData);
        }, logout);

      }

      function authorizeUserResponseHandler(sessionDataFromAPI) {
        var rawSessionData = angular.copy(sessionDataFromAPI);
        encryptDataInLS(rawSessionData);
        getCompanyData(rawSessionData);
      }

      function login(credentials) {
        var payload = {
          username: credentials.username,
          password: CryptoJS.SHA256(credentials.username + credentials.password).toString(CryptoJS.enc.Base64)
        };
        identityAccessService.authorizeUser(payload).then(authorizeUserResponseHandler, broadcastError);
      }

      $rootScope.$on('logout', logout);
      $rootScope.$on('unauthorized', logout);
      $rootScope.$on('$locationChangeStart', locationChangeHandler);
      setSessionHeaders();

      return {
        login: login,
        changePassword: changePassword,
        sendEmail: sendEmail,
        logout: logoutFromSystem,
        getSessionObject: getSessionObject,
        setSessionData: setSessionData,
        isAuthorized: isAuthorized
      };
    }
  );
