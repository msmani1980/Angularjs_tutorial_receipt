'use strict';

angular.module('ts5App')
  .directive('eposConfigSingleModule', function ($compile) {
    var eposConfigSingleModuleController = function ($scope) {
      $scope.popover = [];

      $scope.hidePopover = function (item) {
        $scope.popover[item] = false;
      };


    };

    return {
      restrict: 'E',
      scope: {
        singleModule: '=',
        model: '=',
        areInputsDisabled: '='
      },
      templateUrl: 'views/directives/epos-config-form-single-module.html',
      link: function (scope, element) {
        var collectionSt = '<epos-config-modules module-list="singleModule.subModules" model="model" are-inputs-disabled="areInputsDisabled"></epos-config-modules>';
        if (scope.singleModule.subModules && angular.isArray(scope.singleModule.subModules)) {
          $compile(collectionSt)(scope, function(cloned)   {
            element.append(cloned);
          });
        }
      },
      controller: eposConfigSingleModuleController
    };
  });
