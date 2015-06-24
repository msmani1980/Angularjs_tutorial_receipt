'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MenuRelationshipCreateCtrl
 * @description
 * # MenuRelationshipCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuRelationshipCreateCtrl', function ($scope, $location,
    $routeParams, menuService) {

    var $this = this;
    $scope.formData = {
      menuCode: '',
      menuName: '',
      stations: [],
      startDate: '',
      endDate: ''
    };
    $scope.viewName = 'Create Menu Relationship';
    $scope.buttonText = 'Create';
    $scope.menuIsActive = false;
    $scope.menuIsInactive = false;
    $scope.viewOnly = false;
    $scope.editingItem = false;

    this.checkIfViewOnly = function () {
      var path = $location.path();
      if (path.search('/menu-relationship-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    this.setFormAsViewOnly = function () {
      $scope.viewName = 'Viewing Item ' + $routeParams.id;
    };

    this.setFormAsEdit = function () {
      $scope.editingItem = true;
      $scope.viewName = 'Edit Item ' + $routeParams.id;
      $scope.buttonText = 'Save';
    };

    // gets an item to $scope.editingItem
    this.getItem = function (id) {

      // TODO: Make this use a loadingModal.show() method
      angular.element('#loading').modal('show').find('p')
        .text('We are getting Item ' + id);

      menuService.getMenu(id).then(function (data) {
        $this.updateFormData(data);
        angular.element('#loading').modal('hide');
      });

    };

    this.updateFormData = function (data) {
      $scope.formData = data;
    };

    this.checkIfViewOnly();

    if ($scope.viewOnly) {
      this.setFormAsViewOnly();
    }

    if ($routeParams.id && !$scope.viewOnly) {
      this.setFormAsEdit();
    }

    if ($scope.editingItem || $scope.viewOnly) {
      this.getItem($routeParams.id);
    }


  });
