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
    $routeParams, menuService, catererStationService,
    menuCatererStationsService, dateUtility, $q) {

    var $this = this;
    $scope.formData = {
      startDate: '',
      endDate: ''
    };
    $scope.viewName = 'Create Relationship';
    $scope.buttonText = 'Create';
    $scope.relationshipIsActive = false;
    $scope.relationshipIsInactive = false;
    $scope.viewOnly = false;
    $scope.editingRelationship = false;

    this.init = function () {
      this.checkIfViewOnly();
      if ($routeParams.id && !$scope.viewOnly) {
        this.setFormAsEdit();
      }
      if ($scope.editingRelationship || $scope.viewOnly) {
        this.getRelationship($routeParams.id);
      }
    };

    this.checkIfViewOnly = function () {
      var path = $location.path();
      if (path.search('/menu-relationship-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    this.setFormAsEdit = function () {
      $scope.editingRelationship = true;
      $scope.buttonText = 'Save';
    };

    this.updateViewName = function () {
      var prefix = 'Viewing';
      if ($scope.editingRelationship) {
        prefix = 'Editing';
      }
      var menuIndex = this.findMenuIndex($scope.formData.menuId);
      $scope.viewName = prefix + ' ' + $scope.menuList[menuIndex].menuName +
        '\'s Catering Stations';
    };

    this.makePromises = function (id) {
      return [
        menuCatererStationsService.getRelationship(id),
        catererStationService.getCatererStationList(),
        menuService.getMenuList()
      ];
    };

    this.getRelationship = function (id) {
      angular.element('#loading').modal('show').find('p')
        .text('We are getting Relationship ' + $routeParams.id);
      var promises = this.makePromises(id);
      $q.all(promises).then(function (response) {
        $this.updateFormData(response[0]);
        $this.setCatererStationList(response[1]);
        $this.setMenuList(response[2]);
        $this.updateViewName();
        angular.element('#loading').modal('hide');
      });
    };

    this.setCatererStationList = function (apiResponse) {
      $scope.stationList = apiResponse.response;
      $this.initSelectUI();
    };

    this.setMenuList = function (apiResponse) {
      $scope.menuList = apiResponse.menus;
    };

    this.findMenuIndex = function (menuId) {
      var menuIndex = null;
      for (var key in $scope.menuList) {
        var menu = $scope.menuList[key];
        if (parseInt(menu.menuId) === parseInt(menuId)) {
          menuIndex = key;
          break;
        }
      }
      return menuIndex;
    };

    this.findStationIndex = function (stationId) {
      var stationIndex = null;
      for (var key in $scope.stationList) {
        var station = $scope.stationList[key];
        if (parseInt(station.id) === parseInt(stationId)) {
          stationIndex = key;
          break;
        }
      }
      return stationIndex;
    };

    /*$scope.isStationSelected = function (stationId) {
      var stationIndex = $this.findStationIndex(stationId);
    };*/

    this.initSelectUI = function () {
      angular.element('.multi-select').select2({
        width: '100%'
      });
    };

    this.updateFormData = function (data) {
      data.startDate = dateUtility.formatDate(data.startDate, 'YYYYMMDD',
        'L');
      data.endDate = dateUtility.formatDate(data.endDate,
        'YYYYMMDD', 'L');
      $scope.formData = data;
    };

    this.updateRelationship = function (relationshipData) {
      var $this = this;
      angular.element('#loading').modal('show').find('p').text(
        'We are updating your menu');
      menuCatererStationsService.updateRelationship($routeParams.id,
        relationshipData).then(
        function (response) {
          $this.updateFormData(response);
          angular.element('#loading').modal('hide');
          angular.element('#update-success').modal('show');
        },
        function (response) {
          angular.element('#loading').modal('hide');
          $scope.displayError = true;
          $scope.formErrors = response.data;
        });
    };

    this.createRelationship = function (relationshipData) {
      angular.element('#loading').modal('show').find('p').text(
        'We are creating your menu');
      menuCatererStationsService.createRelationship(relationshipData).then(
        function () {
          angular.element('#loading').modal('hide');
          angular.element('#create-success').modal('show');
        },
        function (error) {
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
      var relationshipData = angular.copy(formData);
      console.log(relationshipData);
      $this.formatPayloadDates(relationshipData);
      if ($scope.editingRelationship) {
        $this.updateRelationship(relationshipData);
      } else {
        $this.createRelationship(relationshipData);
      }
    };

    this.formatPayloadDates = function (relationship) {
      relationship.startDate = dateUtility.formatDate(relationship.startDate,
        'L',
        'YYYYMMDD');
      relationship.endDate = dateUtility.formatDate(relationship.endDate,
        'L', 'YYYYMMDD');
    };

    this.init();

  });
