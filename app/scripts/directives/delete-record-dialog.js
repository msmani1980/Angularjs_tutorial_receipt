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

      $scope.deleteRecordDialog = function (itemId) {
        $this.modalElement.modal('show');
        $scope.itemToDelete = itemId;
      };

      $scope.deleteRecord = function () {
        $this.modalElement.modal('hide');
        $scope.removeItem($scope.itemToDelete);
      };

    };

    return {
      templateUrl: '/views/directives/delete-record-dialog.html',
      restrict: 'E',
      scope: false,
      controller: deleteRecordDialogController
    };
  });
