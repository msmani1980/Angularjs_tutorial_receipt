'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ChangePasswordCtrl
 * @description
 * # ChangePasswordCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ChangePasswordCtrl', function ($scope, $http, identityAccessFactory) {

    $scope.passwords = {
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

    function handleSuccessResponse() {
      hideLoadingModal();
    }

    function handleAuthorizeUserResponseError(responseFromAPI) {
      hideLoadingModal();
      responseFromAPI.data = [
        {
          field: 'Password',
          value: 'does not match our records.'
        }
      ];
      $scope.errorResponse = responseFromAPI;
      $scope.displayError = true;
    }

    function callChangePassword() {
      identityAccessFactory.changePassword({
        username: sessionObject.username,
        password: $scope.passwords.newPassword
      }).then(handleSuccessResponse, handleResponseError);
    }

    function handleAuthorizeUserSuccessResponse() {
      callChangePassword() ;
    }

    $scope.changePassword = function () {
      if ($scope.changePasswordForm.$invalid) {
        return;
      }
      showLoadingModal('Changing password');

      if (!$scope.hasSessionToken) {
        identityAccessFactory.login({
          username: sessionObject.username,
          password: $scope.passwords.currentPassword
        }).then(handleAuthorizeUserSuccessResponse, handleAuthorizeUserResponseError);
      } else {
        callChangePassword() ;
      }
    };
  });
