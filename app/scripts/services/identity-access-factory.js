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
  .factory('identityAccessFactory',
    function (identityAccessService, $rootScope, $http, $localStorage, $location, $timeout, $window, companyFactory, $q, lodash, eulaService, companyFormatService, $interval, $document) {

      var tempToken;

      // Timer data used to automatically log out user after X period of time
      var timerInterval;
      var timerStates = {
        PENDING: 0,
        STARTED: 1
      };
      var timerState = timerStates.PENDING;
      var checkIntervalInSeconds = 5;
      var timeoutSessionAfterMinutes;
      var sessionSecondsLeft;

      loadSessionTimerConfiguration();
      startSessionTimeoutTimer();

      var bodyElement = angular.element($document);
      angular.forEach(['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'focus'],
        function(EventName) {
          bodyElement.bind(EventName, function (e) { resetSessionTimeoutTimer(e) });
        });
      // End timer data

      function changePassword(credentials, sessionToken) {
        var payload = {
          username: credentials.username.toLowerCase(),
          password: CryptoJS.SHA256(credentials.username.toLowerCase() + credentials.password).toString(CryptoJS.enc.Base64)
        };
        return identityAccessService.changePassword(payload, sessionToken);
      }

      function checkAuth(sessionToken) {
        return identityAccessService.checkAuth(sessionToken);
      }

      function sendRecoveryEmail(usernameOrPassword, emailContent, emailAddress, username) {
        var shouldRecoverUsername = usernameOrPassword === 'username';
        var usernameToSend = (!username) ? '' : username.toLowerCase();

        return identityAccessService.sendEmail(shouldRecoverUsername, emailContent, emailAddress, usernameToSend);
      }

      function logoutFromSystem() {
        identityAccessService.logout().then(function () {
          stopSessionTimeoutTimer();
        });
      }

      function logout(sessionTimeoutHappened) {
        stopSessionTimeoutTimer();

        $window.localStorage.clear();
        $localStorage.$reset();
        delete $http.defaults.headers.common.userId;
        delete $http.defaults.headers.common.companyId;
        delete $http.defaults.headers.common.sessionToken;

        $timeout(function () {
          if (sessionTimeoutHappened) {
            $location.path('/login').search({sessionTimeout: 'true'});
          } else {
            $location.path('/login');
          }
        });
      }

      function logoutDueTheSessionTimeout() {
        logout(true);

        console.log('show modal here');
      }

      function loadSessionTimerConfiguration() {
        if ($localStorage.timeoutSessionAfterMinutes) {
          setSessionTTLInMinutes(parseInt($localStorage.timeoutSessionAfterMinutes));
        } else {
          setSessionTTLInMinutes(8 * 60); // 8 hours default
        }
      }

      function setSessionTTLInMinutes(ttlInMinutes) {
        timeoutSessionAfterMinutes = ttlInMinutes;
        sessionSecondsLeft = timeoutSessionAfterMinutes * 60;

        $localStorage.timeoutSessionAfterMinutes = timeoutSessionAfterMinutes;

        console.log('TTL set to ' + ttlInMinutes + ' minutes')
      }

      function stopSessionTimeoutTimer() {
        if (timerState !== timerStates.STARTED) {
          console.log('Stop called but timer is not started')
          return;
        }
        $interval.cancel(timerInterval);
        timerState = timerStates.PENDING;
        console.log('Timer stopped')
      }

      function startSessionTimeoutTimer() {
        if (!isAuthorized()) {
          return;
        }

        if (timerState !== timerStates.PENDING) {
          console.log('Start called but timer is already started')
          return;
        }

        timerInterval = $interval(checkForSessionTimeout, checkIntervalInSeconds * 1000);
        timerState = timerStates.STARTED;
        console.log('Timer started')
      }

      function resetSessionTimeoutTimer() {
        console.log('Timer reset')
        sessionSecondsLeft = timeoutSessionAfterMinutes * 60;
      }

      function checkForSessionTimeout() {
        if (sessionSecondsLeft <= 0) {
          console.log('Logout reached')
          logoutDueTheSessionTimeout();
        }

        sessionSecondsLeft = sessionSecondsLeft - checkIntervalInSeconds;

        console.log('Decrease session seconds left to ' + sessionSecondsLeft)
      }

      function getSessionObject() {
        if ($localStorage.sessionObject) {
          return JSON.parse(CryptoJS.AES.decrypt($localStorage.sessionObject, 'aes@56').toString(CryptoJS.enc.Utf8));
        }

        return {};
      }

      function persistCompanyObject(sessionObject) {
        if (sessionObject.companyData) {
          $localStorage.companyObject = sessionObject.companyData;
          $localStorage.companyObject.companyId = sessionObject.companyId;
          $localStorage.companyObject.formatList = sessionObject.companyFormatList;
          $localStorage.companyObject.companyTypeId = sessionObject.companyData.companyTypeId;
          $localStorage.companyObject.userCompanyTimezoneOffset = sessionObject.userTimeZone;
        }
      }

      function setSessionHeaders() {
        var sessionObject = angular.copy(getSessionObject());
        persistCompanyObject(sessionObject);

        delete sessionObject.companyData;
        delete sessionObject.userCompanies;
        delete sessionObject.companyTypes;
        delete sessionObject.currentSession;
        delete sessionObject.companyFormatList;
        angular.extend($http.defaults.headers.common, sessionObject);
      }

      function encryptDataInLS(dataFromAPI) {
        var sessionObject = {
          timeout: 60000,
          userId: dataFromAPI.id,
          username: dataFromAPI.userName,
          companyId: dataFromAPI.companyId,
          companyData: dataFromAPI.companyData,
          companyFormatList: dataFromAPI.companyFormatList,
          userCompanies: dataFromAPI.userCompanies,
          userTimeZone: dataFromAPI.usersCompanyTimeZone,
          companyTypes: dataFromAPI.companyTypes,
          currentSession: dataFromAPI.currentSession,
          sessionToken: dataFromAPI.currentSession.sessionToken
        };
        $localStorage.sessionObject = CryptoJS.AES.encrypt(JSON.stringify(sessionObject), 'aes@56').toString();
        setSessionHeaders();
      }

      function broadcastSuccess(companyData) {
        $location.search('username', null);
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
        var refererReportAuth = $location.search().reportAuth;
        var refererReportId = $location.search().report;
        if (refererReportAuth === 'invalid' && refererReportId !== null) {
          $location.url($location.path('/'));
          $http.get('/report-api/templates', { headers: { sessionToken: getSessionObject().sessionToken } });
          window.location.href = '/report-api/reports/' + refererReportId + '?sessionToken=' + getSessionObject().sessionToken;
        } else {
          $location.path('/');
        }

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

      function parseCompanyFormatList(formatList) {
        return lodash.object(lodash.map(angular.copy(formatList), function (item) {
          return [item.format.dataType, item.format.format];
        }));
      }

      function formatUserCompanies (companyDataFromAPI, rawSessionData) {
        var userCompanyList = angular.copy(companyDataFromAPI.companies);
        var allCompaniesList = angular.copy(rawSessionData.companiesView);

        if (!allCompaniesList) {
          return userCompanyList;
        }

        return lodash.filter(userCompanyList, function (company) {
          var companyMatch = lodash.findWhere(allCompaniesList, { id: company.id });
          return (angular.isDefined(companyMatch) ? companyMatch.active === 't' : false);
        });
      }

      function getCompanyResponseHandler(dataFromAPI, rawSessionData) {
        var sessionObject = angular.copy(rawSessionData);
        sessionObject.companyData = angular.copy(dataFromAPI[0]);
        sessionObject.companyTypes = angular.copy(dataFromAPI[1]);
        sessionObject.userCompanies = formatUserCompanies(dataFromAPI[2], rawSessionData);
        sessionObject.usersCompanyTimeZone = angular.copy(dataFromAPI[2].user.timezoneOffset || 0);
        sessionObject.companyFormatList = parseCompanyFormatList(dataFromAPI[3].response);
        sessionObject.companyData.companyTypeName = angular.copy(lodash.findWhere(sessionObject.companyTypes, {
          id: sessionObject.companyData.companyTypeId
        }).companyTypeName);

        if (sessionObject.companyData.companyTypeName === 'Cash Handler' || sessionObject.companyData.companyTypeId === 5) {
          var chCompanyList = angular.copy(lodash.findWhere(sessionObject.userCompanies, { type: { companyTypeName: 'Retail' } }));

          if (chCompanyList !== undefined) {
            chCompanyList.companyId = chCompanyList.id;
            sessionObject.companyData.chCompany = angular.copy(chCompanyList);
          }

        }

        if (dataFromAPI[2].misc && dataFromAPI[2].misc.timeoutMin) {
          var sessionTimeoutInMinutes = dataFromAPI[2].misc.timeoutMin;
          console.log('Configuration loaded and set to ' + sessionTimeoutInMinutes)
          setSessionTTLInMinutes(sessionTimeoutInMinutes);
          startSessionTimeoutTimer();
        }

        setSessionData(sessionObject);
      }

      function getCompanyData(rawSessionData) {
        var companyDataPromiseArray = [
          companyFactory.getCompany(rawSessionData.companyId),
          companyFactory.getCompanyTypes(),
          identityAccessService.getUserCompanies(),
          companyFormatService.getCompanyFormatList()
        ];

        $q.all(companyDataPromiseArray).then(function (dataFromApi) {
          getCompanyResponseHandler(dataFromApi, rawSessionData);
        }, logout);
      }

      function setSelectedCompany(companyData) {
        $http.defaults.headers.common.companyId = angular.copy(companyData.id);
        var rawSessionData = angular.copy(getSessionObject());
        rawSessionData.companyId = companyData.id;
        rawSessionData.chCompany = companyData.chCompany;
        rawSessionData.id = rawSessionData.userId;
        getCompanyData(rawSessionData);
      }

      function authorizeUserResponseHandler(sessionDataFromAPI) {
        var rawSessionData = angular.copy(sessionDataFromAPI);
        encryptDataInLS(rawSessionData);
        getCompanyData(rawSessionData);
      }

      function userAgreesToEULA(creds) {
        angular.element('#loading').modal('show');
        identityAccessService.userAgreesToEULA(tempToken).then(function () {
          login(creds);
        });

        tempToken = undefined;
      }

      function checkForEULA(rawSessionData) {
        if (rawSessionData.eulaRecent === true) {
          return authorizeUserResponseHandler(rawSessionData);
        }

        var dataFromAPI = angular.copy(rawSessionData);
        encryptDataInLS(dataFromAPI);
        tempToken = dataFromAPI.currentSession.sessionToken;
        eulaService.showEULAConfirmation();
        $rootScope.userAgreesToEULA = userAgreesToEULA;
      }

      function login(credentials) {
        var _password = CryptoJS.SHA256(credentials.username.toLowerCase() + credentials.password).toString(CryptoJS.enc.Base64);
        var _pwdo = CryptoJS.SHA256(credentials.username + credentials.password).toString(CryptoJS.enc.Base64);
        var payload = {
          username: credentials.username.toLowerCase(),
          password: _password,
          pwdo: _pwdo === _password ? '' : _pwdo
        };
        identityAccessService.authorizeUser(payload).then(checkForEULA, broadcastError);
      }

      $rootScope.$on('logout', logout);
      $rootScope.$on('unauthorized', logout);
      $rootScope.$on('http-session-timeout', logoutDueTheSessionTimeout);
      $rootScope.$on('$locationChangeStart', locationChangeHandler);
      setSessionHeaders();

      return {
        login: login,
        changePassword: changePassword,
        sendRecoveryEmail: sendRecoveryEmail,
        logout: logoutFromSystem,
        logout1: logout,
        getSessionObject: getSessionObject,
        setSessionData: setSessionData,
        isAuthorized: isAuthorized,
        checkAuth: checkAuth,
        checkForEULA: checkForEULA,
        setSelectedCompany: setSelectedCompany
      };
    });
