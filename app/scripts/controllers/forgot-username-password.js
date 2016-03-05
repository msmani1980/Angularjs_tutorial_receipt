'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ForgotUsernamePasswordCtrl
 * @description
 * # ForgotUsernamePasswordCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ForgotUsernamePasswordCtrl', function ($scope, $http, identityAccessFactory) {

    $scope.forgot = {
      email: '',
      field: ''
    };

    $scope.responseMessage = '';

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
          field: 'Email',
          value: 'Email address could not be found. Please try again or contact your system administrator.'
        }
      ];
      $scope.errorResponse = responseFromAPI;
      $scope.displayError = true;
    }

    function handleSuccessResponse() {
      hideLoadingModal();
      $scope.responseMessage = 'Success: An email containing your ' + $scope.forgot.field + ' has been sent.';
    }

    // Email body only. Subject is defined by BE
    var passwordText = '<p>A request has been received to reset your password.</p>';
    passwordText += '<p>Click the link below to personally reset your password.</p>';
    passwordText += '<p><a href="{1}/#/change-password?sessionToken={0}">Click here to change password.</a></p>';

    var usernameText = '<p>You (or some else) have requested your username.</p>';
    usernameText += '<p>Your username is: <strong>{0}</strong></p>';
    usernameText += '<p>Click the link below to login to the system:</p>';
    usernameText += '<p><a href="{0}/#/login">Click here to login.</a></p>';

    var emailContent = {
      username: usernameText,
      password: passwordText
    };

    $scope.getRecoveryRequirements = function () {
      if ($scope.forgot.field === 'username') {
        return 'email';
      }

      return 'username and email';
    };

    $scope.sendEmail = function () {
      if ($scope.forgotForm.$invalid) {
        return;
      }

      showLoadingModal('Sending email');
      identityAccessFactory.sendRecoveryEmail($scope.forgot.field, emailContent[$scope.forgot.field], $scope.forgot.email, $scope.forgot.username).then(handleSuccessResponse,
        handleResponseError);
    };
  });
