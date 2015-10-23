'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('LoginCtrl', function ($scope) {

    $scope.credentials = {
      username: '',
      password: ''
    };
    $scope.login = function () {
      //console.log('login', $scope.credentials);
    };
  });
