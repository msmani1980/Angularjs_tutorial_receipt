'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('LoginCtrl', function ($scope, $http, identityAccessFactory) {

    $scope.credentials = {
      username: '',
      password: ''
    };

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
          field: 'Username or Password',
          value: 'does not match our records.'
        }
      ];
      $scope.errorResponse = responseFromAPI;
      $scope.displayError = true;
    }

    function handleSuccessResponse(responseFromAPI) {
      hideLoadingModal();
      identityAccessFactory.setSessionData(angular.copy(responseFromAPI));
    }

    $scope.login = function () {
      if ($scope.loginForm.$invalid) {
        return;
      }
      showLoadingModal('Authenticating');
      identityAccessFactory.login($scope.credentials).then(handleSuccessResponse, handleResponseError);
    };
  });
