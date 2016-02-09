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

    var sessionObject = identityAccessFactory.getSessionObject();
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

    function getCredentials() {
      return {
        username: $scope.credentials.username,
        password: $scope.credentials.newPassword
      };
    }

    function handleSuccessResponse() {
      $location.url($location.path());
      var credentials = getCredentials();
      hideLoadingModal();
      identityAccessFactory.login(credentials);
    }

    $scope.changePassword = function () {
      if ($scope.changePasswordForm.$invalid) {
        return;
      }

      showLoadingModal('Changing password');
      var credentials = getCredentials();
      var headers = {
        sessionToken: $routeParams.sessionToken || sessionObject.sessionToken
      };
      identityAccessFactory.changePassword(credentials, headers).then(handleSuccessResponse, handleResponseError);
    };

  });
