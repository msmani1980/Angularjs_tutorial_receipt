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
    catererStationService, menuCatererStationsService, messageService, $http) {

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
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      this.checkIfViewOnly();
      if ($routeParams.id && !$scope.viewOnly) {
        this.setFormAsEdit();
      }

      if ($scope.editingRelationship || $scope.viewOnly) {
        this.getRelationship($routeParams.id);
      } else {
        this.getRelationshipDependencies();
      }

      $scope.minDate = dateUtility.nowFormattedDatePicker();
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

      if (menuIndex) {
        $scope.viewName = prefix + ' Menu ' + $scope.menuList[menuIndex].menuCode + ' Catering Stations';
      } else {
        menuService.getMenuList({ menuId: $scope.formData.menuId }).then(function (dataFromAPI) {
          angular.extend($scope.menuList, dataFromAPI.menus);

          var menuIndex = $this.findMenuIndex($scope.formData.menuId);
          $scope.viewName = prefix + ' Menu ' + $scope.menuList[menuIndex].menuCode + ' Catering Stations';
        });
      }

    };

    this.generateItemQuery = function() {
      var todaysDate = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      var query = {
        startDate: todaysDate,
        sortBy: 'ASC'
      };
      return query;
    };

    this.makePromises = function(id) {
      var query = this.generateItemQuery();
      var promises = [
        catererStationService.getCatererStationList(query),
        menuService.getMenuList(query, false)
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

    $scope.isStartDateSelected = function () {
      return $scope.formData.startDate !== 'undefined' && $scope.formData.startDate !== null && $scope.formData.startDate !== undefined && $scope.formData.startDate !== null;
    };

    $scope.isEndDateSelected = function () {
      return $scope.formData.endDate !== 'undefined' && $scope.formData.endDate !== null && $scope.formData.endDate !== undefined && $scope.formData.endDate !== null;
    };

    this.getCatererStationsForDateRange = function(startDate, endDate) {
      var catererStationsPayload = {
        startDate: dateUtility.formatDateForAPI(startDate),
        endDate: dateUtility.formatDateForAPI(endDate),
        sortBy: 'ASC'
      };

      catererStationService.getCatererStationList(catererStationsPayload).then(setCatererStationList, errorHandler);
    };

    $scope.$watchGroup(['formData.startDate', 'formData.endDate'], function() {
      if ($scope.isStartDateSelected() && $scope.isEndDateSelected) {
        $this.getCatererStationsForDateRange($scope.formData.startDate, $scope.formData.endDate);
      }
    }, true);

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
        var stationCode = (stationIndex !== null) ? $scope.stationList[stationIndex].code : 'Invalid Station';
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
      data.startDate = dateUtility.formatDateForApp(data.startDate);
      data.endDate = dateUtility.formatDateForApp(data.endDate);
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
      relationship.startDate = dateUtility.formatDateForAPI(relationship.startDate);
      relationship.endDate = dateUtility.formatDateForAPI(relationship.endDate);
    };

    $scope.isRelationshipActive = function() {
      if ($scope.editingRelationship) {
        return dateUtility.isTodayOrEarlierDatePicker($scope.formData.startDate);
      }

      return false;
    };

    $scope.isRelationshipInactive = function() {
      if ($scope.editingRelationship) {
        return dateUtility.isYesterdayOrEarlierDatePicker($scope.formData.endDate);
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

    $scope.isCreate = function () {
      return $location.path() === '/menu-relationship-create';
    };

    $scope.getUpdateBy = function (menu) {
      if (menu.updatedByPerson) {
        return menu.updatedByPerson.userName;
      }

      if (menu.createdByPerson) {
        return menu.createdByPerson.userName;
      }

      if ($scope.isCreate()) {
        return $http.defaults.headers.common.username;
      }

      return 'Unknown';
    };

    $scope.getUpdatedOn = function (menu) {
      if (!menu.createdOn) {
        return 'Unknown';
      }

      return menu.updatedOn ? dateUtility.formatTimestampForApp(menu.updatedOn) : dateUtility.formatTimestampForApp(menu.createdOn);
    };

    this.init();

  });
