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
          value: 'EMAIL ADDRESS COULD NOT BE FOUND. PLEASE TRY AGAIN OR CONTACT YOUR SYSTEM ADMINISTRATOR.'
        }
      ];
      $scope.errorResponse = responseFromAPI;
      $scope.displayError = true;
    }

    function handleSuccessResponse() {
      $scope.responseMessage = 'Success: An email containing your ' + $scope.forgot.field + ' has been sent.';
    }

    var emailContent = {
      'username' :
      `TS5 Security - username recovery
        <h3>Hi, </h3>
        <p>You (or some else) have requested your username.</p>
        <p>Your username is: <strong>{2}</strong></p>
        <p>Click the link below to login to the system:</p>
        <p><a href="{1}/#/login?sessionToken={0}">Click here to login.</a></p>
        <br> eGate`,

        'password' :
        `TS5 Security - password recovery
        <h3>Hi, {2},</h3>
        <p>Please, <a href="{1}/#/change-password?sessionToken={0}">click here</a> to change your password.
        </p><br>eGate`
    };

    $scope.sendEmail = function () {
      if ($scope.forgotForm.$invalid) {
        return;
      }
      showLoadingModal('Sending email');
      identityAccessFactory.sendEmail($scope.forgot.email, emailContent[$scope.forgot.field]).then(handleSuccessResponse, handleResponseError);
    };
  });
