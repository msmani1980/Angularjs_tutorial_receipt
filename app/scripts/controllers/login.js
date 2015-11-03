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

    //function handleResponseError(responseFromAPI) {
    //  hideLoadingModal();
    //  $scope.formErrors = {
    //    status: responseFromAPI.status,
    //    statusText: responseFromAPI.statusText
    //  };
    //  $scope.displayError = true;
    //}

    function handleSuccessResponse(responseFromAPI) {
      hideLoadingModal();
      identityAccessFactory.setSessionData(angular.copy(responseFromAPI));
    }

    $scope.login = function () {
      if ($scope.loginForm.$invalid) {
        return;
      }
      var fakeResponse = {
        id: 1,
        companyId: 403,
        currentSession: {
          sessionToken: '9e85ffbb3b92134fbf39a0c366bd3f12f0f5'
        }
      };
      showLoadingModal('Authenticating');
      //identityAccessFactory.login($scope.credentials).then(handleSuccessResponse, handleResponseError);
      identityAccessFactory.login($scope.credentials).then(
        function () {
          handleSuccessResponse(fakeResponse);
        },
        function () {
          handleSuccessResponse(fakeResponse);
        });
    };
  });
