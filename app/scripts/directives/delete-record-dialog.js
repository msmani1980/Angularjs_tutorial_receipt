'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:deleteRecordDialog
 * @description
 * # deleteRecordDialog
 */
angular.module('ts5App')
  .directive('deleteRecordDialog', function () {

    var deleteRecordDialogController = function ($scope) {

      var $this = this;

      $scope.deleteRecordDialog = function (itemId, propertyNamesToDisplayArray) {
        angular.element('#delete-record').modal('show');
        $scope.itemToDelete = itemId;
        $this.formatDisplayedValues(propertyNamesToDisplayArray);
      };

      this.formatDisplayedValues = function (propertyNamesToDisplayArray) {
        $scope.displayedItemProperties = [];
        if (!propertyNamesToDisplayArray) {
          return;
        }

        angular.forEach(propertyNamesToDisplayArray, function (name) {
          var value = $scope.itemToDelete[name];
          if (value) {
            $scope.displayedItemProperties.push({ key: name, value: value });
          }
        });
      };

      $scope.deleteRecord = function () {
        angular.element('#delete-record').modal('hide');
        $scope.removeRecord($scope.itemToDelete);
      };

    };

    return {
      templateUrl: '/views/directives/delete-record-dialog.html',
      restrict: 'E',
      scope: false,
      controller: deleteRecordDialogController
    };
  });
