'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:leaveViewModal
 * @description
 * # leaveViewModal
 */
angular.module('ts5App')
  .directive('leaveViewModalNav', function () {

    var leaveViewNavController = function ($scope, $location) {

      var $this = this;

      // Show leave view modal
      $scope.leaveViewNav = function (path) {

        $scope.leavePathNav = path;
        var currentPath = $location.path();
        var onEditView = $this.checkIfEditing();

        $this.setModalElement();
        $this.hideModal();

        if (onEditView && currentPath !== $scope.leavePathNav) {
          $this.showModal();
        } else {
          $this.hideModal();
          $this.navigateTo($scope.leavePathNav);
        }

      };

      this.setModalElement = function () {
        this.modalElement = angular.element('#leave-view-modal-nav');
      };

      this.showModal = function () {
        this.modalElement.modal('show');
      };

      this.hideModal = function () {
        this.modalElement.modal('hide');
      };

      this.navigateTo = function (path) {
        $location.path(path);
      };

      this.checkIfEditing = function () {
        var path = $location.path();
        if (path.search('create') !== -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.leaveViewClose = function () {

        $this.setModalElement();
        $this.hideModal();
        $this.modalElement.on('hidden.bs.modal', function () {
          $location.path($scope.leavePathNav);
          $scope.$apply();
        });

      };

    };

    return {
      templateUrl: '/views/directives/leave-view-modal-nav.html',
      restrict: 'E',
      scope: false,
      controller: leaveViewNavController

    };

  });
