'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:topNavigationBar
 * @description
 * # topNavigationBar
 */
angular.module('ts5App')
  .directive('topNavigationBar', function (GlobalMenuService) {

    function link($scope) {
      $scope.settingsModel = GlobalMenuService.settings;
      $scope.userModel = GlobalMenuService.user;
      $scope.companyModel = GlobalMenuService.company;
    }

    return {
      templateUrl: '/views/directives/top-navigation-bar.html',
      restrict: 'E',
      scope: {
        elementClass: '@',
        labelFrom: '@',
        labelTo: '@',
        nameFrom: '@',
        nameTo: '@',
        disablePast: '@',
        disableStartDate: '=',
        disableEndDate: '=',
        disableDateRange: '@',
        isSearchField: '@',
        minDate: '=',
        maxDate: '=',
        startDateModel: '=',
        endDateModel: '=',
        required: '@'
      },
      link: link
    };
  });
