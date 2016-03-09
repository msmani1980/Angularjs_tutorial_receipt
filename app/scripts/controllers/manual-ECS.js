'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ExciseDutyListCtrl
 * @description
 * # ExciseDutyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualECSCtrl', function ($scope, $q, manualECSFactory, globalMenuService, dateUtility, lodash, messageService) {

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    }

    $scope.toggleActiveView = function (showCreateView) {
      $scope.isCreateViewActive = showCreateView;
    };

    $scope.canSaveRelationship = function () {
      return ($scope.selectedPortalRecord && $scope.selectedEposRecord);
    };

    $scope.isRecordSelected = function (portalOrEpos, record) {
      if (portalOrEpos === 'portal') {
        return (!!$scope.selectedPortalRecord) ? (record.id === $scope.selectedPortalRecord.id) : false;
      }

      return (!!$scope.selectedEposRecord) ? (record.id === $scope.selectedEposRecord.id) : false;
    };

    $scope.selectRecord = function (portalOrEpos, record) {
      if (portalOrEpos === 'portal') {
        $scope.selectedPortalRecord = record;
        return;
      }

      $scope.selectedEposRecord = record;
    };

    $scope.getClassForAttribute = function (portalOrEpos, attribute, record) {
      var attributeToClassMap = {
        button: 'btn btn-sm btn-default',
        icon: 'fa fa-circle-thin',
        row: ''
      };
      if ($scope.isRecordSelected(portalOrEpos, record)) {
        attributeToClassMap = {
          button: 'btn btn-sm btn-success',
          icon: 'fa fa-check-circle',
          row: 'bg-success'
        };
      }

      return attributeToClassMap[attribute] || '';
    };

    function getStoreInstancesSuccess(dataFromAPI) {
      hideLoadingModal();
      $scope.storeInstances = angular.copy(dataFromAPI.response) || [];
      angular.forEach($scope.storeInstances, function (storeInstance) {
        storeInstance.scheduleDate = dateUtility.formatDateForApp(storeInstance.scheduleDate);
        var stationMatch = lodash.findWhere($scope.companyStationList, { stationId: storeInstance.cateringStationId });
        storeInstance.stationDescription = (!!stationMatch) ? stationMatch.stationCode : '';
      });
    }

    function getStoreInstances(payload) {
      showLoadingModal('Retrieving Portal Store Instanes');
      manualECSFactory.getStoreInstanceList(payload).then(getStoreInstancesSuccess, showErrors);
    }

    function getUnTiedCarrierInstancesSuccess(dataFromAPI) {
      hideLoadingModal();
      $scope.carrierInstances = angular.copy(dataFromAPI.response);
      angular.forEach($scope.carrierInstances, function (carrierInstance) {
        carrierInstance.instanceDate = dateUtility.formatDateForApp(carrierInstance.instanceDate);
      });
    }

    function getUnTiedCarrierInstances(payload) {
      payload.storeInstanceId = 0;
      showLoadingModal('Retrieving ePOS Instances');
      manualECSFactory.getCarrierInstanceList(payload).then(getUnTiedCarrierInstancesSuccess, showErrors);
    }

    function getTiedCarrierInstancesSuccess(dataFromAPI) {
      hideLoadingModal();
      $scope.allECSInstances = angular.copy(dataFromAPI.response);
      angular.forEach($scope.allECSInstances, function (carrierInstance) {
        carrierInstance.instanceDate = dateUtility.formatDateForApp(carrierInstance.instanceDate);
      });
    }

    function getTiedCarrierInstances(payload) {
      showLoadingModal('Retrieving ePOS Instances');
      manualECSFactory.getCarrierInstanceList(payload).then(getTiedCarrierInstancesSuccess, showErrors);
    }

    $scope.resetAll = function () {
      $scope.portalSearch = {};
      $scope.eposSearch = {};
      $scope.selectedEposRecord = null;
      $scope.selectedPortalRecord = null;
      $scope.carrierInstances = null;
      $scope.storeInstances = null;
    };

    function saveSuccess() {
      hideLoadingModal();
      $scope.resetAl();
      messageService.display('success', 'Relationship Successfully Created', 'Create ECS Relationship');
    }

    $scope.saveRelationship = function () {
      if (!$scope.canSaveRelationship()) {
        messageService.display('danger', 'Please select two valid records', 'Create ECS Relationship');
        return;
      }

      showLoadingModal('Saving Relationship');
      var payload = {
        storeInstanceId: $scope.selectedPortalRecord.id
      };
      manualECSFactory.updateCarrierInstance($scope.selectedEposRecord.id, payload).then(saveSuccess, showErrors);
    };

    $scope.shouldShowNoRecordAlert = function (portalOrEposOrAll) {
      var arrayToCheck = (portalOrEposOrAll === 'portal') ? $scope.storeInstances : $scope.carrierInstances;
      if (portalOrEposOrAll === 'all') {
        arrayToCheck = $scope.allECSInstances;
      }

      return angular.isDefined(arrayToCheck) && arrayToCheck !== null && arrayToCheck.length <= 0;
    };

    $scope.shouldShowSearchPromptAlert = function (portalOrEposOrAll) {
      var arrayToCheck = (portalOrEposOrAll === 'portal') ? $scope.storeInstances : $scope.carrierInstances;
      if (portalOrEposOrAll === 'all') {
        arrayToCheck = $scope.allECSInstances;
      }

      return arrayToCheck === null || !angular.isDefined(arrayToCheck);
    };

    $scope.clearEposSearch = function () {
      $scope.eposSearch = {};
      $scope.carrierInstances = null;
    };

    $scope.clearPortalSearch = function () {
      $scope.portalSearch = {};
      $scope.storeInstances = null;
    };

    $scope.clearAllInstancesSearch = function () {
      $scope.allInstancesSearch = {};
      $scope.allECSInstances = null;
    };

    function formatAllECSSearchPayload() {
      var searchPayload = {};
      if ($scope.allInstancesSearch.eposScheduleDate) {
        searchPayload.scheduleDate = dateUtility.formatDateForAPI($scope.allInstancesSearch.eposScheduleDate);
      }

      if ($scope.allInstancesSearch.eposStation) {
        searchPayload.departureStation = $scope.allInstancesSearch.eposStation.stationCode;
      }

      if ($scope.allInstancesSearch.eposStoreNumber) {
        searchPayload.storeNumber = $scope.allInstancesSearch.eposStoreNumber;
      }

      if ($scope.allInstancesSearch.storeInstance) {
        searchPayload.storeInstanceId = $scope.allInstancesSearch.storeInstance;
      }

      return searchPayload;
    }

    function formatEposSearchPayload() {
      var searchPayload = {};

      if ($scope.eposSearch.scheduleDate) {
        searchPayload.scheduleDate = dateUtility.formatDateForAPI($scope.eposSearch.scheduleDate);
      }

      if ($scope.eposSearch.station) {
        searchPayload.departureStation = $scope.eposSearch.station.stationCode;
      }

      if ($scope.eposSearch.storeNumber) {
        searchPayload.storeNumber = $scope.eposSearch.storeNumber;
      }

      return searchPayload;
    }

    function formatPortalSearchPayload() {
      var searchPayload = {};

      if ($scope.portalSearch.scheduleDate) {
        searchPayload.scheduleDate = dateUtility.formatDateForAPI($scope.portalSearch.scheduleDate);
      }

      if ($scope.portalSearch.station) {
        searchPayload.cateringStationId = $scope.portalSearch.station.id;
      }

      if ($scope.portalSearch.storeNumber) {
        searchPayload.storeNumber = $scope.portalSearch.storeNumber;
      }

      if ($scope.portalSearch.storeInstance) {
        searchPayload.storeInstanceId = $scope.portalSearch.storeInstance;
      }

      return searchPayload;
    }

    $scope.searchAllECSInstances = function () {
      var searchPayload = formatAllECSSearchPayload();
      getTiedCarrierInstances(searchPayload);
    };

    $scope.searchEposInstances = function () {
      $scope.selectedEposRecord = null;
      var searchPayload = formatEposSearchPayload();
      getUnTiedCarrierInstances(searchPayload);
    };

    $scope.searchPortalInstances = function () {
      $scope.selectedPortalRecord = null;
      var searchPayload = formatPortalSearchPayload();
      getStoreInstances(searchPayload);
    };

    function formatStationDescription() {
      angular.forEach($scope.cateringStationList, function (station) {
        station.stationDescription = station.code + ' - ' + station.name;
      });

      angular.forEach($scope.companyStationList, function (station) {
        station.stationDescription = station.stationCode + ' - ' + station.stationName;
      });
    }

    function completeInit(responseCollectionFromAPI) {
      $scope.cateringStationList = angular.copy(responseCollectionFromAPI[0].response);
      $scope.companyStationList = angular.copy(responseCollectionFromAPI[1].response);
      formatStationDescription();
      hideLoadingModal();
    }

    function makeInitPromises() {
      var companyId = globalMenuService.company.get();
      var promises = [
        manualECSFactory.getCatererStationList({}),
        manualECSFactory.getCompanyStationList(companyId, 0)
      ];
      $q.all(promises).then(completeInit, showErrors);
    }

    function init() {
      showLoadingModal('Initializing data');
      $scope.isCreateViewActive = true;
      $scope.portalSearch = {};
      $scope.eposSearch = {};
      $scope.allInstancesSearch = {};
      $scope.selectedEposRecord = null;
      $scope.selectedPortalRecord = null;
      makeInitPromises();
    }

    init();

  });
