'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MenuRelationshipCreateCtrl
 * @description
 * # MenuRelationshipCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuRelationshipCreateCtrl', function($scope, $location, $routeParams, $q, dateUtility, menuService,
    catererStationService, menuCatererStationsService, messageService) {

    var $this = this;
    $scope.formData = {
      startDate: '',
      endDate: '',
      catererStationIds: []
    };
    $scope.viewName = 'Create Relationship';
    $scope.buttonText = 'Create';
    $scope.viewOnly = false;
    $scope.editingRelationship = false;
    $scope.displayError = false;

    this.init = function() {
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

    this.getRelationshipDependencies = function() {
      angular.element('#loading').modal('show').find('p')
        .text('Getting catering stations...');
      var promises = this.makePromises();
      $q.all(promises).then(function(response) {
        $this.setCatererStationList(response[0]);
        $this.setMenuList(response[1]);
        $this.initSelectUI();
        $this.hideLoadingModal();
      });
    };

    this.checkIfViewOnly = function() {
      var path = $location.path();
      if (path.search('/menu-relationship-view') !== -1) {
        $scope.viewOnly = true;
      }
    };

    this.setFormAsEdit = function() {
      $scope.editingRelationship = true;
      $scope.buttonText = 'Save';
    };

    this.updateViewName = function() {
      var prefix = 'Viewing';
      if ($scope.editingRelationship) {
        prefix = 'Editing';
      }

      var menuIndex = this.findMenuIndex($scope.formData.menuId);
      $scope.viewName = prefix + ' Menu ' + $scope.menuList[menuIndex].menuCode +
        ' Catering Stations';
    };

    this.generateItemQuery = function() {
      var todaysDate = dateUtility.formatDateForAPI(dateUtility.now(), 'x');
      var query = {
        startDate: todaysDate,
        sortBy: 'ASC',
        limit: 100
      };
      return query;
    };

    this.makePromises = function(id) {
      var query = this.generateItemQuery();
      var promises = [
        catererStationService.getCatererStationList(query),
        menuService.getMenuList(query)
      ];
      if (id) {
        promises.push(menuCatererStationsService.getRelationship(id));
      }

      return promises;
    };

    this.getRelationship = function(id) {
      this.displayLoadingModal('We are getting Relationship ' +
        $routeParams.id);
      var promises = this.makePromises(id);
      $q.all(promises).then(function(response) {
        $this.setCatererStationList(response[0]);
        $this.setMenuList(response[1]);
        $this.updateFormData(response[2]);
        $this.initSelectUI();
        $this.updateViewName();
        $this.hideLoadingModal();
      });
    };

    this.setCatererStationList = function(apiResponse) {
      $scope.stationList = apiResponse.response;
    };

    this.setMenuList = function(apiResponse) {
      $scope.menuList = apiResponse.menus;
    };

    this.findMenuIndex = function(menuId) {
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

    this.findStationIndex = function(stationId) {
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

    this.generateSelectedOptions = function(data) {
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

    this.generatePlaceholder = function() {
      var placeholder = 'Search by Station Code';
      if ($scope.viewOnly || $scope.isRelationshipActive() || $scope.isRelationshipInactive()) {
        placeholder = '';
      }

      return placeholder;
    };

    this.initSelectUI = function() {
      var data = [];
      if (angular.isArray($scope.formData.catererStationIds)) {
        data = this.generateSelectedOptions(data);
      }

      angular.element('select.multi-select').select2({
        width: '100%',
        placeholder: $this.generatePlaceholder(),
        allowClear: true,
      }).select2('data', data);
    };

    this.formatStationIds = function(data) {
      for (var key in data.catererStationIds) {
        var stationId = data.catererStationIds[key];
        data.catererStationIds[key] = stationId.toString();
      }
    };

    this.updateFormData = function(data) {
      data.startDate = dateUtility.formatDate(data.startDate,
        'YYYYMMDD',
        'L');
      data.endDate = dateUtility.formatDate(data.endDate,
        'YYYYMMDD', 'L');
      this.formatStationIds(data);
      $scope.formData = data;
    };

    this.displayLoadingModal = function(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.showSuccessMessage = function(message) {
      messageService.display('success', message);
    };

    this.errorHandler = function(apiResponse) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(apiResponse);
    };

    this.updateRelationship = function(relationshipData) {
      var $this = this;
      this.displayLoadingModal('We are updating menu relationship');
      menuCatererStationsService.updateRelationship($routeParams.id,
        relationshipData).then(
        function(response) {
          $this.updateFormData(response);
          $this.initSelectUI();
          $this.hideLoadingModal();
          $this.showSuccessMessage('Relationship updated!');
        }, this.errorHandler);
    };

    this.createRelationship = function(relationshipData) {
      $this.displayLoadingModal('We are creating your menu relationship');
      menuCatererStationsService.createRelationship(relationshipData).then(
        function() {
          $this.hideLoadingModal();
          $this.showSuccessMessage('Relationship created!');
          $location.path('/menu-relationship-list');
        }, this.errorHandler);
    };

    $scope.submitForm = function(formData) {
      $scope.form.$setSubmitted(true);
      if (formData && $this.validateForm()) {
        var relationshipData = angular.copy(formData);
        $this.formatPayloadDates(relationshipData);
        var action = $scope.editingRelationship ? 'updateRelationship' :
          'createRelationship';
        $this[action](relationshipData);
      }
    };

    this.formatPayloadDates = function(relationship) {
      relationship.startDate = dateUtility.formatDate(relationship.startDate,
        'L',
        'YYYYMMDD');
      relationship.endDate = dateUtility.formatDate(relationship.endDate,
        'L', 'YYYYMMDD');
    };

    $scope.isRelationshipActive = function() {
      if ($scope.editingRelationship) {
        return dateUtility.isTodayOrEarlier($scope.formData.startDate);
      }

      return false;
    };

    $scope.isRelationshipInactive = function() {
      if ($scope.editingRelationship) {
        return dateUtility.isYesterdayOrEarlier($scope.formData.endDate);
      }

      return false;
    };

    this.validateForm = function() {
      $scope.displayError = false;
      if (!$scope.form.$valid) {
        $scope.displayError = true;
      }

      return $scope.form.$valid;
    };

    $scope.setInputValidClass = function(inputName) {
      if ($scope.form[inputName].$touched && $scope.form[inputName].$invalid || $scope.displayError && $scope.form[
          inputName].$invalid) {
        return 'has-error';
      }

      if ($scope.form[inputName].$touched && $scope.form[inputName].$valid) {
        return 'has-success';
      }

      return '';
    };

    $scope.setStationsValidClass = function(inputName) {
      if ($scope.form[inputName].$touched && $scope.form[inputName].length < 1 || $scope.displayError && $scope.form[
          inputName].length < 1) {
        return 'has-error';
      }

      if ($scope.form[inputName].$touched && $scope.form[inputName].$valid) {
        return 'has-success';
      }

      return '';
    };

    this.init();

  });
