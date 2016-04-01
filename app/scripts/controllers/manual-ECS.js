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
      return ($scope.selectedPortalRecord && $scope.selectedEposRecords.length);
    };

    $scope.toggleSelectEposRecord = function (ecbGroupId) {
      var groupIndex = $scope.selectedEposRecords.indexOf(ecbGroupId);
      if (groupIndex >= 0) {
        $scope.selectedEposRecords.splice(groupIndex, 1);
        return;
      }

      $scope.selectedEposRecords.push(ecbGroupId);
    };

    $scope.selectPortalRecord = function (record) {
      $scope.selectedPortalRecord = record;
    };

    $scope.canSelectStoreInstance = function (storeInstance) {
      return storeInstance.statusName === 'Inbounded';
    };

    function isRecordSelected(portalOrEpos, record) {
      if (portalOrEpos === 'portal') {
        return (!!$scope.selectedPortalRecord) ? (record.id === $scope.selectedPortalRecord.id) : false;
      }

      return $scope.selectedEposRecords.indexOf(record.ecbGroup.toString()) >= 0;
    }

    $scope.getClassForAttribute = function (portalOrEpos, attribute, record) {
      var attributeToClassMap = {
        button: 'btn btn-sm btn-default',
        icon: 'fa fa-circle-o',
        row: portalOrEpos === 'portal' ? 'category-border' : ''
      };
      if (isRecordSelected(portalOrEpos, record)) {
        attributeToClassMap = {
          button: 'btn btn-sm btn-success',
          icon: 'fa fa-check-circle',
          row: portalOrEpos === 'portal' ? 'category-border bg-success' : 'bg-success'
        };
      }

      return attributeToClassMap[attribute] || '';
    };

    $scope.canOpenEposRow = function (index, ecbGroup) {
      return index === 0 && ecbGroup.length > 1;
    };

    $scope.getAttributeForEposRow = function (attribute, record, index) {
      var attributeToClassMap = {
        indent: 'category-indent',
        nestedIndent: 'category-border',
        row: $scope.getClassForAttribute('epos', 'row', record) || 'categoryLevel2',
      };

      if (index === 0) {
        attributeToClassMap = {
          indent: 'category-border',
          nestedIndent: '',
          row: $scope.getClassForAttribute('epos', 'row', record)
        };
      }

      return attributeToClassMap[attribute] || '';
    };

    $scope.shouldShowCarrierInstanceTable = function () {
      return $scope.carrierInstances && $scope.carrierInstances !== {};
    };

    function getIndexOfOpenGroup(groupId) {
      return $scope.openEposGroups.indexOf(groupId);
    }

    $scope.shouldShowRow = function (groupId, index) {
      var isRowOpen = getIndexOfOpenGroup(groupId) >= 0;
      return index === 0 || isRowOpen;
    };

    $scope.toggleOpenGroup = function (groupId, ecbGroup) {
      if (ecbGroup.length <= 1) {
        return;
      }

      var openIndex = getIndexOfOpenGroup(groupId);
      if (openIndex >= 0) {
        $scope.openEposGroups.splice(openIndex, 1);
        return;
      }

      $scope.openEposGroups.push(groupId);
    };

    $scope.getClassForAccordionButton = function (groupId) {
      var isOpen = getIndexOfOpenGroup(groupId) >= 0;
      return isOpen ? 'fa fa-angle-down' : 'fa fa-angle-right';
    };

    function getStoreInstancesSuccess(dataFromAPI) {
      hideLoadingModal();

      var storeInstancesResponse = angular.copy(dataFromAPI.response) || [];
      var allowedStatuses = [
        'Ready For Packing',
        'Ready For Seals',
        'Ready for Dispatch',
        'Dispatched',
        'On Floor',
        'Inbound Seals',
        'Unpacking',
        'Inbounded'
      ];

      $scope.storeInstances = lodash.filter(storeInstancesResponse, function (storeInstance) {
        storeInstance.scheduleDate = dateUtility.formatDateForApp(storeInstance.scheduleDate, 'YYYY-MM-DD') || '';
        var stationMatch = lodash.findWhere($scope.companyStationList, { stationId: storeInstance.cateringStationId });
        var statusMatch = lodash.findWhere($scope.statusList, { id: storeInstance.statusId });
        storeInstance.stationCode = (!!stationMatch) ? stationMatch.stationCode : '';
        storeInstance.statusName = (!!statusMatch) ? statusMatch.statusName : '';
        return allowedStatuses.indexOf(storeInstance.statusName) >= 0;
      });
    }

    function getStoreInstances(payload) {
      showLoadingModal('Retrieving Portal Store Instanes');
      manualECSFactory.getStoreInstanceList(payload).then(getStoreInstancesSuccess, showErrors);
    }

    function setCarrierInstancesList(carrierInstanceListFromAPI) {
      var carrierInstanceList = angular.copy(carrierInstanceListFromAPI.response);
      angular.forEach(carrierInstanceList, function (carrierInstance) {
        carrierInstance.instanceDate = dateUtility.formatDateForApp(carrierInstance.instanceDate);
        carrierInstance.storeNumber = carrierInstance.storeNumber || '';
      });

      var groupedList = lodash.groupBy(carrierInstanceList, 'ecbGroup');
      $scope.carrierInstances = groupedList;
      hideLoadingModal();
    }

    function getCarrierInstanceGroups(dataFromAPI) {
      var ecbGroupPayload = [];
      angular.forEach(dataFromAPI.response, function (carrierInstance) {
        ecbGroupPayload.push(carrierInstance.ecbGroup);
      });

      var payloadForAPI = {
        ecbGroup: (lodash.uniq(ecbGroupPayload)).toString()
      };

      manualECSFactory.getCarrierInstanceList(payloadForAPI).then(setCarrierInstancesList, showErrors);
    }

    function getUnTiedCarrierInstances(payload) {
      payload.storeInstanceId = 0;
      showLoadingModal('Retrieving ePOS Instances');
      manualECSFactory.getCarrierInstanceList(payload).then(getCarrierInstanceGroups, showErrors);
    }

    function getTiedCarrierInstancesSuccess(dataFromAPI) {
      hideLoadingModal();
      $scope.allECSInstances = angular.copy(dataFromAPI.response);
      angular.forEach($scope.allECSInstances, function (carrierInstance) {
        carrierInstance.instanceDate = dateUtility.formatDateForApp(carrierInstance.instanceDate);
        carrierInstance.siScheduleDate = dateUtility.formatDateForApp(carrierInstance.siScheduleDate);
      });
    }

    function getTiedCarrierInstances(payload) {
      showLoadingModal('Retrieving ePOS Instances');
      manualECSFactory.getCarrierInstanceList(payload).then(getTiedCarrierInstancesSuccess, showErrors);
    }

    $scope.resetAll = function () {
      $scope.portalSearch = {};
      $scope.eposSearch = {};
      $scope.selectedEposRecords = [];
      $scope.openEposGroups = [];
      $scope.selectedPortalRecord = null;
      $scope.carrierInstances = null;
      $scope.storeInstances = null;
    };

    function saveSuccess() {
      hideLoadingModal();
      $scope.resetAll();
      messageService.display('success', 'Relationship Successfully Created', 'Create ECS Relationship');
    }

    $scope.showSaveConfirmation = function () {
      angular.element('#confirmRelationshipModal').modal('show');
    };

    $scope.dismissSaveConfirmation = function () {
      angular.element('#confirmRelationshipModal').modal('hide');
    };

    function getArrayOfAllIdsInGroup(groupId) {
      var ecbGroup = $scope.carrierInstances[groupId];
      var idArray = [];
      angular.forEach(ecbGroup, function (carrierInstance) {
        idArray.push(carrierInstance.id);
      });

      return idArray;
    }

    function createSaveRelationshipPromise() {
      var allCarrierInstanceIds = [];
      angular.forEach($scope.selectedEposRecords, function (groupId) {
        allCarrierInstanceIds = allCarrierInstanceIds.concat(getArrayOfAllIdsInGroup(groupId));
      });

      var promises = [];
      var payload = {
        storeInstanceId: $scope.selectedPortalRecord.id
      };

      angular.forEach(allCarrierInstanceIds, function (carrierInstanceId) {
        promises.push(manualECSFactory.updateCarrierInstance(carrierInstanceId, payload));
      });
    }

    $scope.saveRelationship = function () {
      $scope.dismissSaveConfirmation();
      if (!$scope.canSaveRelationship()) {
        messageService.display('danger', 'Please select at least two valid records', 'Create ECS Relationship');
        return;
      }

      showLoadingModal('Saving Relationship');
      var promises = createSaveRelationshipPromise();
      $q.all(promises).then(saveSuccess, showErrors);
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

    function formatAllECSEposSearchPayload(workingPayload) {
      if ($scope.allInstancesSearch.eposScheduleDate) {
        workingPayload.instanceDate = dateUtility.formatDateForAPI($scope.allInstancesSearch.eposScheduleDate);
      }

      if ($scope.allInstancesSearch.eposStation) {
        workingPayload.departureStation = $scope.allInstancesSearch.eposStation.stationCode;
      }

      if ($scope.allInstancesSearch.eposStoreNumber) {
        workingPayload.storeNumber = $scope.allInstancesSearch.eposStoreNumber;
      }
    }

    function formatAllECSPortalSearchPayload(workingPayload) {
      if ($scope.allInstancesSearch.portalScheduleDate) {
        workingPayload.siScheduleDate = dateUtility.formatDateForAPI($scope.allInstancesSearch.portalScheduleDate);
      }

      if ($scope.allInstancesSearch.portalStation) {
        workingPayload.siCatererStationCode = $scope.allInstancesSearch.portalStation.code;
      }

      if ($scope.allInstancesSearch.portalStoreNumber) {
        workingPayload.siStoreNumber = $scope.allInstancesSearch.portalStoreNumber;
      }

      if ($scope.allInstancesSearch.storeInstance) {
        workingPayload.storeInstanceId = parseInt($scope.allInstancesSearch.storeInstance);
      }
    }

    function formatAllECSSearchPayload() {
      var searchPayload = {};
      formatAllECSEposSearchPayload(searchPayload);
      formatAllECSPortalSearchPayload(searchPayload);
      return searchPayload;
    }

    function formatEposSearchPayload() {
      var searchPayload = {};

      if ($scope.eposSearch.scheduleDate) {
        searchPayload.instanceDate = dateUtility.formatDateForAPI($scope.eposSearch.scheduleDate);
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
      var searchPayload = {
        carrierInstanceCount: 0
      };

      if ($scope.portalSearch.scheduleDate) {
        searchPayload.startDate = dateUtility.formatDateForAPI($scope.portalSearch.scheduleDate);
        searchPayload.endDate = dateUtility.formatDateForAPI($scope.portalSearch.scheduleDate);
      }

      if ($scope.portalSearch.station) {
        searchPayload.cateringStationId = $scope.portalSearch.station.id;
      }

      if ($scope.portalSearch.storeNumber) {
        searchPayload.storeNumber = $scope.portalSearch.storeNumber;
      }

      if ($scope.portalSearch.storeInstance) {
        searchPayload.storeInstanceId = parseInt($scope.portalSearch.storeInstance);
      }

      return searchPayload;
    }

    $scope.searchAllECSInstances = function () {
      var searchPayload = formatAllECSSearchPayload();
      getTiedCarrierInstances(searchPayload);
    };

    $scope.searchEposInstances = function () {
      $scope.selectedEposRecords = [];
      $scope.openEposGroups = [];
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
      $scope.statusList = angular.copy(responseCollectionFromAPI[2]);
      formatStationDescription();
      hideLoadingModal();
    }

    function makeInitPromises() {
      var companyId = globalMenuService.company.get();
      var promises = [
        manualECSFactory.getCatererStationList({}),
        manualECSFactory.getCompanyStationList(companyId, 0),
        manualECSFactory.getStoreStatusList()
      ];
      $q.all(promises).then(completeInit, showErrors);
    }

    function init() {
      showLoadingModal('Initializing data');
      $scope.isCreateViewActive = true;
      $scope.portalSearch = {};
      $scope.eposSearch = {};
      $scope.allInstancesSearch = {};
      $scope.selectedEposRecords = [];
      $scope.selectedPortalRecord = null;
      $scope.openEposGroups = [];
      makeInitPromises();
    }

    init();

  });
