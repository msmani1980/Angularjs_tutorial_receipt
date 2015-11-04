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
  .factory('identityAccessFactory', function (identityAccessService, $rootScope, $http, $localStorage, $location, $timeout, companiesFactory) {

    function login(credentials) {
      var payload = {
        username: credentials.username,
        password: CryptoJS.SHA256(credentials.username + credentials.password).toString(CryptoJS.enc.Base64)
      };
      return identityAccessService.authorizeUser(payload);
    }

    function getCompanyData(companyId) {
      return companiesFactory.getCompany(companyId);
    }

    function logout() {
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
      var sessionObject = getSessionObject();
      $localStorage.company = sessionObject.companyId;
      angular.extend($http.defaults.headers.common, sessionObject);
    }

    function encryptDataInLS(dataFromAPI) {
      var sessionObject = {
        userId: dataFromAPI.id,
        companyId: dataFromAPI.companyId,
        companyData: dataFromAPI.companyData,
        sessionToken: dataFromAPI.currentSession.sessionToken,
        timeout: 60000
      };
      $localStorage.sessionObject = CryptoJS.AES.encrypt(JSON.stringify(sessionObject), 'aes@56').toString();
    }

    function broadcastSuccess(companyData) {
      $rootScope.$broadcast('authorized');
      $rootScope.$broadcast('company-fetched', companyData);
    }

    function setSessionData(dataFromAPI) {
      encryptDataInLS(dataFromAPI);
      setSessionHeaders();
      broadcastSuccess(dataFromAPI.companyData);
      $location.path('/');
    }

    function isAuthorized() {
      return !!(getSessionObject().sessionToken);
    }

    function locationChangeHandler(event, next) {
      if (!isAuthorized() && !next.contains('login')) {
        event.preventDefault();
        logout();
      }
    }

    $rootScope.$on('logout', logout);
    $rootScope.$on('unauthorized', logout);
    $rootScope.$on('$locationChangeStart', locationChangeHandler);
    setSessionHeaders();

    return {
      getCompanyData: getCompanyData,
      login: login,
      getSessionObject: getSessionObject,
      setSessionData: setSessionData,
      isAuthorized: isAuthorized
    };
  });
