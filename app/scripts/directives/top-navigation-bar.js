'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:topNavigationBar
 * @description
 * # topNavigationBar
 */
angular.module('ts5App')
  .directive('topNavigationBar', function (identityAccessFactory) {

    function controller($scope) {

      function hideNavBar() {
        $scope.isAuthorized = false;
      }

      function showNavBar() {
        $scope.isAuthorized = true;
      }

      function callback() {
        $scope.$emit('logout');
      }

      function showCompanyInfo() {
        $scope.isAuthorized = identityAccessFactory.isAuthorized();
        $scope.companyData = identityAccessFactory.getSessionObject().companyData;
      }

      $scope.settingsModel = [];
      $scope.userModel = [{
        id: 1,
        callback: callback,
        class: 'login-btn',
        label: 'logout'
      }];
      $scope.companyModel = [];

      $scope.$on('unauthorized', hideNavBar);
      $scope.$on('logout', hideNavBar);
      $scope.$on('authorized', showNavBar);
      $scope.$on('company-fetched', showCompanyInfo);
      showCompanyInfo();
    }

    return {
      templateUrl: '/views/directives/top-navigation-bar.html',
      restrict: 'E',
      scope: true,
      controller: controller
    };
  });
