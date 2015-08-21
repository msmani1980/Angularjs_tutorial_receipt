'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:formUpdateModal
 * @description
 * # formUpdateModal
 */
angular.module('ts5App')
  .directive('formUpdateModal', function () {

    var controller = function ($scope, $location, $route) {
      $scope.navigateTo = function (path) {
        var currentPath = $location.path();
        var modalElement = angular.element('#update-success');
        modalElement.modal('hide');
        modalElement.on('hidden.bs.modal', function () {
          if (currentPath === path) {
            $route.reload();
          } else {
            $location.path(path);
            $scope.$apply();
          }
        });
      };
    };

    return {
      templateUrl: '/views/directives/form-update-modal.html',
      restrict: 'E',
      scope: {
        listPath: '@'
      },
      controller: controller
    };

  });
