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
    $routeParams, menuService, dateUtility) {

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
    $scope.editingMenu = false;

    this.checkIfViewOnly = function () {
      var path = $location.path();
      if (path.search('/menu-relationship-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    this.setFormAsViewOnly = function () {
      $scope.viewName = 'Viewing Menu ' + $routeParams.id;
    };

    this.setFormAsEdit = function () {
      $scope.editingMenu = true;
      $scope.viewName = 'Edit Menu ' + $routeParams.id;
      $scope.buttonText = 'Save';
    };

    // gets an menu to $scope.editingMenu
    this.getMenu = function (id) {

      // TODO: Make this use a loadingModal.show() method
      angular.element('#loading').modal('show').find('p')
        .text('We are getting Menu ' + id);

      menuService.getMenu(id).then(function (data) {
        $this.updateFormData(data);
        angular.element('#loading').modal('hide');
      });

    };

    this.updateFormData = function (data) {
      data.startDate = dateUtility.formatDate(data.startDate, 'YYYYMMDD',
        'L');
      data.endDate = dateUtility.formatDate(data.endDate, 'YYYYMMDD', 'L');
      $scope.formData = data;
    };

    this.updateMenu = function (menuData) {
      var $this = this;
      angular.element('#loading').modal('show').find('p').text(
        'We are updating your menu');
      menuService.createMenu($routeParams.id, menuData).then(
        function (response) {
          $this.upateFormData(response);
          angular.element('#loading').modal('hide');
          angular.element('#update-success').modal('show');
        },
        function (response) {
          angular.element('#loading').modal('hide');
          $scope.displayError = true;
          $scope.formErrors = response.data;
        });
    };

    this.createMenu = function (menuData) {
      angular.element('#loading').modal('show').find('p').text(
        'We are creating your menu');
      menuService.createMenu(menuData).then(function () {
        angular.element('#loading').modal('hide');
        angular.element('#create-success').modal('show');
      }, function (error) {
        angular.element('#loading').modal('hide');
        $scope.displayError = true;
        $scope.formErrors = error.data;
      });
    };


    $scope.submitForm = function (formData) {
      if (!$scope.form.$valid) {
        $scope.displayError = true;
        return false;
      }
      var menuData = angular.copy(formData);
      $this.formatPayloadDates(menuData);
      if ($scope.editingMenu) {
        $this.updateMenu(menuData);
      } else {
        $this.createMenu(menuData);
      }
    };

    this.formatPayloadDates = function (menu) {
      menu.startDate = dateUtility.formatDate(menu.startDate, 'L',
        'YYYYMMDD');
      menu.endDate = dateUtility.formatDate(menu.endDate, 'L', 'YYYYMMDD');
    };

    this.checkIfViewOnly();

    if ($scope.viewOnly) {
      this.setFormAsViewOnly();
    }

    if ($routeParams.id && !$scope.viewOnly) {
      this.setFormAsEdit();
    }

    if ($scope.editingMenu || $scope.viewOnly) {
      this.getMenu($routeParams.id);
    }

  });
