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
      this.modalElement = angular.element('#delete-record');

      $scope.showDeleteRecordDialog = function (itemId, propertyNamesToDisplayArray) { // TODO: replace all usages, I believe this method name interfeers with directive name
        $this.modalElement.modal('show');
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
        $this.modalElement.modal('hide');
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
