'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:formSuccessModal
 * @description
 * # formSuccessModal
 */
angular.module('ts5App')
  .directive('formSuccessModal', function () {

    var formSuccessController = function ($scope, $location, $route) {

      $scope.navigateTo = function (path) {
        var currentPath = $location.path();
        var modal = angular.element('#create-success');
        modal.modal('hide');
        modal.on('hidden.bs.modal', function () {
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
      templateUrl: 'views/directives/form-success-modal.html',
      restrict: 'E',
      scope: {
        listPath: '@',
        createPath: '@'
      },
      controller: formSuccessController
    };

  });
