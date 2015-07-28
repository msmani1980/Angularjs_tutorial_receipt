'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:dynamicLeftNav
 * @description
 * # dynamicLeftNav
 */
angular.module('ts5App')
  .directive('dynamicLeftNav', function () {

    var dynamicLeftNavController = function ($scope, $location, $injector, $filter) {
      var $this = this;
      var mainMenuService = $injector.get('mainMenuService');
      var menu = mainMenuService.getMenu();
      var menuItems = [];
      if($scope.title) {
        menuItems = $filter('filter')(menu, {title: $scope.title}, true);
      }
      //
      else{
        menuItems = $filter('filter')(menu, {menuItems: {route: $location.path()}});
      }
      if(menuItems.length){
        $scope.menuItems = menuItems[0].menuItems;
      }

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

      $scope.itemClass = function(path) {
        var itemClass = '';
        if('/#'+$location.path() === path){
          itemClass += ' active';
        }
        return itemClass;
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
        if (path.substring(0, 2) === '/#') {
          path = path.substring(2);
        }
        $location.path(path);
      };

      this.checkIfEditing = function () {
        if($scope.isEditing){
          return true;
        }
        var path = $location.path();
        if (path.search('create') !== -1) {
          return true;
        }
        if (path.search('edit') !== -1) {
          return true;
        }
        return false;
      };

      $scope.leaveViewClose = function () {
        $this.setModalElement();
        $this.hideModal();
        $this.modalElement.on('hidden.bs.modal', function () {
          $this.navigateTo($scope.leavePathNav);
          $scope.$apply();
        });

      };
    };

    return {
      templateUrl: '/views/directives/dynamic-left-nav.html',
      restrict: 'E',
      scope: {
        title: '@',
        isEditing: '@'
      },
      controller: dynamicLeftNavController
    };
  });
