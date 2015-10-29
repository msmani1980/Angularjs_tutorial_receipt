'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:topNavigationBar
 * @description
 * # topNavigationBar
 */
angular.module('ts5App')
  .directive('topNavigationBar', function (identityAccessFactory) {

    function link($scope) {

      function hideNavBar() {
        $scope.isAuthorized = false;
      }

      function showNavBar() {
        $scope.isAuthorized = true;
      }

      function callback() {
        $scope.$emit('logout');
      }

      $scope.settingsModel = [];
      $scope.userModel = [{
        id: 1,
        callback: callback,
        class: 'login-btn',
        label: 'logout'
      }];
      $scope.companyModel = [];
      $scope.isAuthorized = identityAccessFactory.isAuthorized();

      $scope.$on('unauthorized', hideNavBar);
      $scope.$on('logout', hideNavBar);
      $scope.$on('authorized', showNavBar);

    }

    return {
      templateUrl: '/views/directives/top-navigation-bar.html',
      restrict: 'E',
      scope: true,
      link: link
    };
  });
