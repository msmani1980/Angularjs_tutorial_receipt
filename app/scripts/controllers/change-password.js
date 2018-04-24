'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ChangePasswordCtrl
 * @description
 * # ChangePasswordCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ChangePasswordCtrl', function ($rootScope, $scope, $http, $routeParams, $location, $window, identityAccessFactory) {

    $scope.credentials = {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: ''
    };

    var $this = this;
    var sessionObject = identityAccessFactory.getSessionObject();
    this.headers = {
      sessionToken: $routeParams.sessionToken || sessionObject.sessionToken
    };
    $scope.hasSessionToken = angular.isDefined(sessionObject.sessionToken);

    function showLoadingModal(text) {
      $scope.displayError = false;
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function handleResponseError(responseFromAPI) {
      hideLoadingModal();
      responseFromAPI.data = [
        {
          field: 'Password',
          value: 'cannot be changed.'
        }
      ];
      $scope.errorResponse = responseFromAPI;
      $scope.displayError = true;
    }

    function handlePasswordMismatch() {
      $scope.errorCustom = [
        {
          field: 'Password',
          value: 'Passwords do not match.'
        }
      ];
      $scope.displayError = true;
    }

    function handlePasswordUsernameMatch() {
      $scope.errorCustom = [
        {
          field: 'Password',
          value: 'Username and password can not be equal'
        }
      ];
      $scope.displayError = true;
    }

    function getCredentials() {
      return {
        username: $scope.credentials.username,
        password: $scope.credentials.newPassword,
        currentPassword: $scope.credentials.currentPassword
      };
    }

    function resetCredentials() {
      $scope.credentials.currentPassword = '';
      $scope.credentials.newPassword = '';
      $scope.credentials.newPasswordConfirm = '';
    }

    function handleSuccessResponse() {
      hideLoadingModal();
      handleSuccessLoginResponse();
    }

    $scope.changePassword = function () {
      if ($scope.credentials.newPassword !== $scope.credentials.newPasswordConfirm) {
        handlePasswordMismatch();
        return;
      }

      if ($scope.credentials.newPassword === $scope.credentials.username) {
        handlePasswordUsernameMatch();
        return;
      }

      if ($scope.changePasswordForm.$invalid) {
        return;
      }

      var credentials = getCredentials();

      $scope.credentials.currentPassword = '';
      $scope.credentials.newPassword = '';
      $scope.credentials.newPasswordConfirm = '';

      showLoadingModal('Changing password');
      identityAccessFactory.changePassword(credentials, $this.headers).then(handleSuccessResponse, handleResponseError);
    };

    function handleSuccessLoginResponse() {
      identityAccessFactory.logout1();
      $location.search('sessionToken', null);
      $location.search('username', $scope.credentials.username);
      $location.path('/#/login');
      $window.location.reload();
    }

    function checkAuthSuccess(dataFromAPI) {
      var userInfo = angular.copy(dataFromAPI);
      $scope.credentials.username = userInfo.userName;
      $scope.credentials.email = userInfo.email;
    }

    identityAccessFactory.checkAuth($this.headers).then(checkAuthSuccess, handleResponseError);

  });
