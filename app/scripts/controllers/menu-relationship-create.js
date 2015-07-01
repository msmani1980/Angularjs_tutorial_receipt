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
      } else {
        this.getRelationshipDependencies();
      }
    };

    this.getRelationshipDependencies = function () {
      angular.element('#loading').modal('show').find('p')
        .text('Getting catering stations...');
      var promises = this.makePromises();
      $q.all(promises).then(function (response) {
        $this.setCatererStationList(response[0]);
        $this.setMenuList(response[1]);
        $this.initSelectUI();
        angular.element('#loading').modal('hide');
      });
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
      $scope.viewName = prefix + ' Menu ' + $scope.menuList[menuIndex].menuCode +
        ' Catering Stations';
    };

    this.makePromises = function (id) {
      var promises = [
        catererStationService.getCatererStationList(),
        menuService.getMenuList()
      ];
      if (id) {
        promises.push(menuCatererStationsService.getRelationship(id));
      }
      return promises;
    };

    this.getRelationship = function (id) {
      angular.element('#loading').modal('show').find('p')
        .text('We are getting Relationship ' + $routeParams.id);
      var promises = this.makePromises(id);
      $q.all(promises).then(function (response) {
        $this.setCatererStationList(response[0]);
        $this.setMenuList(response[1]);
        $this.updateFormData(response[2]);
        $this.initSelectUI();
        $this.updateViewName();
        angular.element('#loading').modal('hide');
      });
    };

    this.setCatererStationList = function (apiResponse) {
      $scope.stationList = apiResponse.response;
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

    this.generateSelectedOptions = function (data) {
      for (var key in $scope.formData.catererStationIds) {
        var stationId = $scope.formData.catererStationIds[key];
        var stationIndex = this.findStationIndex(stationId);
        var stationCode = $scope.stationList[stationIndex].code;
        data.push({
          id: stationId,
          text: stationCode
        });
      }
      return data;
    };

    this.initSelectUI = function () {
      var data = [];
      if ($scope.formData.catererStationIds && $scope.formData.catererStationIds
        .length > 0) {
        data = this.generateSelectedOptions(data);
      }
      angular.element('select.multi-select').select2({
        width: '100%',
        placeholder: 'Search by Station Code',
        allowClear: true,
      }).select2('data', data);
    };

    this.formatStationIds = function (data) {
      for (var key in data.catererStationIds) {
        var stationId = data.catererStationIds[key];
        data.catererStationIds[key] = stationId.toString();
      }
    };

    this.updateFormData = function (data) {
      data.startDate = dateUtility.formatDate(data.startDate,
        'YYYYMMDD',
        'L');
      data.endDate = dateUtility.formatDate(data.endDate,
        'YYYYMMDD', 'L');
      this.formatStationIds(data);
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
          $this.initSelectUI();
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
      $scope.displayError = false;
      if (!$scope.form.$valid) {
        $scope.displayError = true;
        return false;
      }
      var relationshipData = angular.copy(formData);
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

    $scope.isRelationshipActive = function () {
      return Date.parse($scope.formData.startDate) <= dateUtility.now();
    };

    $scope.isRelationshipInactive = function () {
      return Date.parse($scope.formData.startDate) <= dateUtility.now();
    };

    this.init();

  });
