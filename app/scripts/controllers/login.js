'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('LoginCtrl', function ($scope, $http, identityAccessFactory, $rootScope) {

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

    function handleResponseError(event, responseFromAPI) {
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

    $scope.login = function () {
      if ($scope.loginForm.$invalid) {
        return;
      }

      showLoadingModal('Authenticating');
      identityAccessFactory.login($scope.credentials);
    };

    $rootScope.$on('authorized', hideLoadingModal);
    $rootScope.$on('un-authorized', handleResponseError);
  });
