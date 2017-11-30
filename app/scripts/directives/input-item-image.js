'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:inputItemImage
 * @description
 * # inputItemImage
 */
angular.module('ts5App')
  .directive('inputItemImage', function () {

    return {

      templateUrl: 'views/directives/input-item-image.html',
      restrict: 'E',
      scope: true

    };

  });

angular.module('ts5App')
  .directive('inputItemImageUploadConfirm', function () {

    return {

      templateUrl: 'views/directives/input-item-image-upload-confirm.html',
      restrict: 'E',
      scope: true

    };

  });
