'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceCreateCtrl
 * @description
 * # StoreInstanceCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstanceCreateCtrl',
  function ($scope, storeInstanceFactory, ngToast, dateUtility, GlobalMenuService, storeInstanceDispatchWizardConfig,
            $location, schedulesService, menuCatererStationsService, lodash) {

    $scope.cateringStationList = [];
    $scope.menuMasterList = [];
    $scope.filteredMenuList = [];
    $scope.carrierNumbers = [];
    $scope.storesList = [];
    $scope.scheduleNumbers = [];
    $scope.formData = {
      scheduleDate: dateUtility.nowFormatted(),
      menus: []
    };
    $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps();

    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
    var companyId = GlobalMenuService.company.get();
    var $this = this;

    this.getFormattedDatesPayload = function () {
      return {
        startDate: dateUtility.formatDateForAPI($scope.formData.scheduleDate),
        endDate: dateUtility.formatDateForAPI($scope.formData.scheduleDate)
      };
    };

    this.setCatererStationList = function (dataFromAPI) {
      $scope.cateringStationList = dataFromAPI.response;
    };

    this.getCatererStationList = function () {
      storeInstanceFactory.getCatererStationList().then(this.setCatererStationList);
    };

    this.menuCatererResponseHandler = function (dataFromAPI) {
      $scope.filteredMenuList = [];
      $scope.formData.menus = [];
      angular.forEach(dataFromAPI.companyMenuCatererStations, function (menuCaterer) {
        var filteredMenu = lodash.findWhere($scope.menuMasterList, {id: menuCaterer.menuId});
        if (filteredMenu) {
          $scope.filteredMenuList.push(filteredMenu);
        }
      });
    };

    $scope.getMenuCatererList = function () {
      if (!$scope.formData.cateringStationId || !$scope.formData.scheduleDate) {
        return;
      }
      var payload = angular.extend({}, $this.getFormattedDatesPayload(),
        {catererStationId: $scope.formData.cateringStationId});
      menuCatererStationsService.getRelationshipList(payload).then($this.menuCatererResponseHandler);
    };

    this.menuMasterResponseHandler = function (dataFromAPI) {
      $scope.menuMasterList = dataFromAPI.companyMenuMasters;
      $scope.getMenuCatererList();
    };

    this.getMenuMasterList = function () {
      var query = this.getFormattedDatesPayload();
      storeInstanceFactory.getMenuMasterList(query).then(this.menuMasterResponseHandler);
    };

    this.setCarrierNumbers = function (dataFromAPI) {
      $scope.carrierNumbers = dataFromAPI.response;
    };

    this.getCarrierNumbers = function () {
      storeInstanceFactory.getAllCarrierNumbers(companyId).then(this.setCarrierNumbers);
    };

    this.setStoresList = function (dataFromAPI) {
      $scope.storesList = dataFromAPI.response;
    };

    this.getStoresList = function () {
      var query = this.getFormattedDatesPayload();
      query.readyToUse = true;
      storeInstanceFactory.getStoresList(query).then(this.setStoresList);
    };

    this.exitOnSave = function (response) {
      $this.hideLoadingModal();
      $this.showMessage('success', 'Store Instance created id: ' + response.id);
      $location.url('/store-instance-dashboard/');
    };

    this.createStoreInstanceSuccessHandler = function (response) {
      $this.hideLoadingModal();
      if (response.id) {
        $this.showMessage('success', 'Store Instance created id: ' + response.id);
        $location.url('/store-instance-packing/' + response.id);
      }
    };

    this.createStoreInstanceErrorHandler = function (response) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      if (response.data) {
        $scope.formErrors = response.data;
        return false;
      }
      $scope.response500 = true;
      return false;
    };

    this.resetErrors = function () {
      $scope.formErrors = [];
      $scope.errorCustom = [];
      $scope.displayError = false;
      $scope.response500 = false;
    };

    this.formatMenus = function (menus) {
      var newMenus = [];
      angular.forEach(menus, function (menu) {
        newMenus.push({
          menuMasterId: menu.id
        });
      });
      return newMenus;
    };

    this.formatPayload = function () {
      var payload = angular.copy($scope.formData);
      payload.menus = this.formatMenus(payload.menus);
      payload.scheduleDate = dateUtility.formatDateForAPI(payload.scheduleDate);
      payload.scheduleNumber = payload.scheduleNumber.scheduleNumber;
      return payload;
    };

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.showMessage = function (type, message) {
      ngToast.create({
        className: type,
        dismissButton: true,
        content: message
      });
    };

    this.validateForm = function () {
      this.resetErrors();
      if ($scope.createStoreInstance.$valid && $scope.formData.menus.length > 0) {
        return true;
      }
      $scope.displayError = true;
      return false;
    };

    this.createStoreInstance = function (saveAndExit) {
      this.displayLoadingModal('Creating a store instance');
      var payload = this.formatPayload();
      if (!payload) {
        return false;
      }
      storeInstanceFactory.createStoreInstance(payload).then(( saveAndExit ? this.exitOnSave : this.createStoreInstanceSuccessHandler ),
        this.createStoreInstanceErrorHandler);
    };

    $scope.submitForm = function (saveAndExit) {
      $scope.createStoreInstance.$setSubmitted(true);
      if ($this.validateForm()) {
        $this.createStoreInstance(saveAndExit);
      }
      return false;
    };

    $scope.validateInput = function (fieldName) {
      if ($scope.createStoreInstance[fieldName].$pristine && !$scope.createStoreInstance.$submitted) {
        return '';
      }
      if ($scope.createStoreInstance[fieldName].$invalid || angular.isDefined($scope.createStoreInstance[fieldName].$error.required)) {
        return 'has-error';
      }
      return 'has-success';
    };

    $scope.validateMenus = function () {
      if (angular.isUndefined($scope.createStoreInstance.Menus) || $scope.createStoreInstance.Menus.$pristine && !$scope.createStoreInstance.$submitted) {
        return '';
      }
      if ($scope.formData.menus.length === 0) {
        $scope.createStoreInstance.Menus.$setValidity('required', false);
        return 'has-error';
      }
      $scope.createStoreInstance.Menus.$setValidity('required', true);
      return 'has-success';
    };

    $scope.saveAndExit = function () {
      return $scope.submitForm(true);
    };


    this.setScheduleNumbers = function (apiData) {
      if (!apiData || !apiData.meta.count) {
        return;
      }
      $scope.scheduleNumbers = apiData.schedules.map(function (schedule) {
        return {scheduleNumber: schedule.scheduleNumber};
      });
    };

    this.getScheduleNumbers = function () {
      $scope.scheduleNumbers = [];
      if (!$scope.formData.scheduleDate) {
        this.setScheduleNumbers();
        return;
      }
      var datesForApi = this.getFormattedDatesPayload();
      schedulesService.getSchedulesInDateRange(companyId, datesForApi.startDate,
        datesForApi.endDate).then(this.setScheduleNumbers);
    };

    $scope.$watch('formData.scheduleDate', function (newDate, oldDate) {
      if (newDate && newDate !== oldDate) {
        delete $scope.formData.storeId;
        delete $scope.formData.scheduleNumber;
        $this.getMenuMasterList();
        $this.getStoresList();
        $this.getScheduleNumbers();
      }
    });

    this.init = function () {
      this.getCatererStationList();
      this.getMenuMasterList();
      this.getStoresList();
      this.getCarrierNumbers();
      this.getScheduleNumbers();
    };
    this.init();

  });
