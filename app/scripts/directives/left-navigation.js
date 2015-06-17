'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:leftNavigation
 * @description
 * # leftNavigation
 */
angular.module('ts5App')
  .directive('leftNavigation', function () {

    var leftNavigationController = function ($scope, $location) {

      $scope.locationPath = $location.path();
      switch ($scope.basePath) {
      case 'retail-items':

        $scope.itemListPath = '/item-list';
        $scope.itemCreatePath = '/item-create';
        $scope.manageCategoriesPath = '/ember/#/retail-items/categories';
        $scope.itemPrefix = 'Retail Items';

        break;

      case 'stock-owner-items':

        $scope.itemListPath = '/stock-owner-item-list';
        $scope.itemCreatePath = '/stock-owner-item-create';
        $scope.manageCategoriesPath =
          '/ember/#/stock-owner-item/categories';
        $scope.itemPrefix = 'Stock Owner Items';

        break;

      case 'menu-relationship':

        $scope.menuRelationshipListPath = '/menu-relationship-list';
        $scope.menuRelationshipCreatePath = '/menu-relationship-create';
        $scope.itemPrefix = 'Menu Relationship';

        break;


      }

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
      templateUrl: '/views/directives/left-navigation.html',
      restrict: 'E',
      scope: {
        basePath: '@'
      },
      controller: leftNavigationController
    };

  });
