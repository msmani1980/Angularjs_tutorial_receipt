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
  .factory('identityAccessFactory', function(identityAccessService, $rootScope, $http, $localStorage, $location,
    $timeout, $window, companyFactory, $q, lodash, eulaService) {
    function changePassword(credentials, sessionToken) {
      var payload = {
        username: credentials.username,
        password: CryptoJS.SHA256(credentials.username + credentials.password).toString(CryptoJS.enc.Base64)
      };
      return identityAccessService.changePassword(payload, sessionToken);
    }

    function checkAuth(sessionToken) {
      return identityAccessService.checkAuth(sessionToken);
    }

    function sendRecoveryEmail(usernameOrPassword, emailContent, emailAddress, username) {
      var shouldRecoverUsername = usernameOrPassword === 'username';
      var usernameToSend = (!username) ? '' : username;

      return identityAccessService.sendEmail(shouldRecoverUsername, emailContent, emailAddress, usernameToSend);
    }

    function logoutFromSystem() {
      identityAccessService.logout();
    }

    function logout() {
      $window.localStorage.clear();
      delete $localStorage.sessionObject;
      delete $localStorage.companyObject;
      delete $localStorage.company;
      delete $localStorage.cashBagBankRefNumber;
      delete $http.defaults.headers.common.userId;
      delete $http.defaults.headers.common.companyId;
      delete $http.defaults.headers.common.sessionToken;
      $timeout(function() {
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
        $localStorage.companyObject = sessionObject.companyData;
        $localStorage.companyObject.companyId = sessionObject.companyId;
        $localStorage.companyObject.companyTypeId = sessionObject.companyData.companyTypeId;
      }

      delete sessionObject.username;
      delete sessionObject.companyData;
      delete sessionObject.userCompanies;
      delete sessionObject.companyTypes;
      delete sessionObject.currentSession;
      angular.extend($http.defaults.headers.common, sessionObject);
    }

    function encryptDataInLS(dataFromAPI) {
      var sessionObject = {
        timeout: 60000,
        userId: dataFromAPI.id,
        username: dataFromAPI.userName,
        companyId: dataFromAPI.companyId,
        companyData: dataFromAPI.companyData,
        userCompanies: dataFromAPI.userCompanies,
        companyTypes: dataFromAPI.companyTypes,
        currentSession: dataFromAPI.currentSession,
        sessionToken: dataFromAPI.currentSession.sessionToken
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
      var allowedURLsArray = allowedHashArray.filter(function(url) {
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

    function getCompanyResponseHandler(dataFromAPI, rawSessionData) {
      var sessionObject = angular.copy(rawSessionData);
      sessionObject.companyData = angular.copy(dataFromAPI[0]);
      sessionObject.companyData.chCompany = angular.copy(rawSessionData.chCompany);
      sessionObject.companyTypes = angular.copy(dataFromAPI[1]);
      sessionObject.userCompanies = angular.copy(dataFromAPI[2].companies);
      sessionObject.companyData.companyTypeName = angular.copy(lodash.findWhere(sessionObject.companyTypes, {
        id: sessionObject.companyData.companyTypeId
      }).name);
      setSessionData(sessionObject);
    }

    function getCompanyData(rawSessionData) {
      var companyDataPromiseArray = [
        companyFactory.getCompany(rawSessionData.companyId),
        companyFactory.getCompanyTypes(),
        identityAccessService.getUserCompanies()
      ];

      $q.all(companyDataPromiseArray).then(function(dataFromApi) {
        getCompanyResponseHandler(dataFromApi, rawSessionData);
      }, logout);
    }

    function setSelectedCompany(companyData) {
      var rawSessionData = angular.copy(getSessionObject());
      rawSessionData.companyId = companyData.id;
      rawSessionData.chCompany = companyData.chCompany;
      rawSessionData.id = rawSessionData.userId;
      getCompanyData(rawSessionData);
    }

    function setEULA(eulaList) {
      $rootScope.eula = eulaList.response[0].eula;
    }

    function getEULAList() {
      return eulaService.getEULAList().then(setEULA);
    }

    function showEULAConfirmation() {
      getEULAList();
      var modal = angular.element('#confirmation-modal');
      var loading = angular.element('#loading');
      modal.modal('show');
      loading.modal('hide');
    }

    function authorizeUserResponseHandler(sessionDataFromAPI) {
      var rawSessionData = angular.copy(sessionDataFromAPI);
      encryptDataInLS(rawSessionData);
      getCompanyData(rawSessionData);
    }

    function checkForEULA(rawSessionData) {
      if (rawSessionData.eulaRecent === false) {
        showEULAConfirmation();
        return false;
      } else if (rawSessionData.eulaRecent === true) {
        return authorizeUserResponseHandler(rawSessionData);
      }
    }

    function login(credentials) {
      var payload = {
        username: credentials.username,
        password: CryptoJS.SHA256(credentials.username + credentials.password).toString(CryptoJS.enc.Base64)
      };
      identityAccessService.authorizeUser(payload).then(checkForEULA, broadcastError);
    }

    $rootScope.$on('logout', logout);
    $rootScope.$on('unauthorized', logout);
    $rootScope.$on('$locationChangeStart',
      locationChangeHandler);
    setSessionHeaders();

    return {
      login: login,
      changePassword: changePassword,
      sendRecoveryEmail: sendRecoveryEmail,
      logout: logoutFromSystem,
      getSessionObject: getSessionObject,
      setSessionData: setSessionData,
      isAuthorized: isAuthorized,
      checkAuth: checkAuth,
      setSelectedCompany: setSelectedCompany
    };
  });
