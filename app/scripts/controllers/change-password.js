'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ChangePasswordCtrl
 * @description
 * # ChangePasswordCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ChangePasswordCtrl', function ($rootScope, $scope, $http, $routeParams, $location, identityAccessFactory) {

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
        password: $scope.credentials.newPassword
      };
    }

    function handleSuccessResponse() {
      var credentials = getCredentials();
      hideLoadingModal();
      identityAccessFactory.login(credentials);
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
      showLoadingModal('Changing password');
      identityAccessFactory.changePassword(credentials, $this.headers).then(handleSuccessResponse, handleResponseError);
    };

    identityAccessFactory.checkAuth($this.headers).then(function (dataFromAPI) {
      var userInfo = angular.copy(dataFromAPI);
      $scope.credentials.username = userInfo.userName;
      $scope.credentials.email = userInfo.email;
    }, handleResponseError);

  });
