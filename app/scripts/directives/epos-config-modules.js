'use strict';

angular.module('ts5App')
  .directive('eposConfigModules', function () {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        moduleList: '=',
        model: '=',
        areInputsDisabled: '='
      },
      templateUrl: 'views/directives/epos-config-form-modules.html'
    };
  });
