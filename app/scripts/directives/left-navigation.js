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
      case 'cash-bag' :

        $scope.itemListPath = '/exchange-rates';
        $scope.manageRetailItemIcon = 'icon-manage-transactions';
        $scope.manageRetailItemLabel = 'Daily Exchange Rates';


        $scope.itemCreatePath = '/cash-bag-list';
        $scope.itemCreateIcon = 'icon-create-receipt-rules';
        $scope.itemCreateLabel = 'Manage Cash Bag';

        $scope.manageCategoriesPath = '/ember/#/cash-bag-submission';
        $scope.manageRetailCatIcon = 'icon-manage-retail-category';
        $scope.manageRetailCatLabel = 'Cash Bag Submission';

        $scope.itemPrefix = 'Cash Bag';

        break;

      case 'retail-items':

        $scope.itemListPath = '/item-list';
        $scope.manageRetailItemIcon = 'icon-manage-retail-item';
        $scope.manageRetailItemLabel = 'Manage Retail Items';

        $scope.itemCreatePath = '/item-create';
        $scope.itemCreateIcon = 'icon-create-retail-item';
        $scope.itemCreateLabel = 'Create Retail Item';

        $scope.manageCategoriesPath = '/ember/#/retail-items/categories';
        $scope.manageRetailCatIcon = 'icon-manage-retail-category';
        $scope.manageRetailCatLabel = 'Manage Item Categories';

        $scope.itemPrefix = 'Retail';

        break;

      case 'stock-owner-items':

        $scope.itemListPath = '/stock-owner-item-list';
        $scope.manageRetailItemIcon = 'icon-manage-retail-item';
        $scope.manageRetailItemLabel = 'Manage Stock Owner Items';

        $scope.itemCreatePath = '/stock-owner-item-create';
        $scope.itemCreateIcon = 'icon-create-retail-item';
        $scope.itemCreateLabel = 'Create Stock Owner Item';

        $scope.manageCategoriesPath = '/ember/#/retail-items/categories';
        $scope.manageRetailCatIcon = 'icon-manage-retail-category';
        $scope.manageRetailCatLabel = 'Manage Item Categories';

        $scope.itemPrefix = 'Stock Owner';

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
        }
        if (path.search('edit') !== -1) {
          return true;
        }
        if (path.search('exchange-rates') !== -1) {
          return true;
        }
        return false;
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
