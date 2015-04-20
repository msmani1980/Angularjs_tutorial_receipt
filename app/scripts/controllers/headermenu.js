'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:HeadermenuCtrl
 * @description
 * # HeadermenuCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('HeaderMenuCtrl', function ($scope, GlobalMenuService) {

    $scope.languageModel = GlobalMenuService.language;
    $scope.userModel = GlobalMenuService.user;
    $scope.companyModel = GlobalMenuService.company;
  });
