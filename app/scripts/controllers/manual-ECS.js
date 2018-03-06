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

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    $scope.allECSInstances = [];
    $scope.storeInstances = [];
    $scope.isCreateSearch = false;
    $scope.isViewSearch = false;

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
      this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
    };

    $scope.canSaveRelationship = function () {
      return ($scope.selectedPortalRecord && $scope.selectedEposRecords.length);
    };

    $scope.toggleSelectEposRecord = function (parentRecord) {
      var groupIndex = $scope.selectedEposRecords.indexOf(parentRecord);
      if (groupIndex >= 0) {
        $scope.selectedEposRecords.splice(groupIndex, 1);
        return;
      }

      $scope.selectedEposRecords.push(parentRecord);
    };

    $scope.selectPortalRecord = function (record) {
      $scope.selectedPortalRecord = record;
    };

    $scope.canSelectStoreInstance = function (storeInstance) {
      return storeInstance.statusName === 'Inbounded' || storeInstance.statusName === 'Dispatched';
    };

    function isRecordSelected(portalOrEpos, record) {
      if (portalOrEpos === 'portal') {
        return (!!$scope.selectedPortalRecord) ? (record.id === $scope.selectedPortalRecord.id) : false;
      }

      return $scope.selectedEposRecords.indexOf(record) >= 0;
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

    $scope.getClassForEposInstanceRow = function (parentInstance, isChild) {
      var defaultClass = isChild ? 'categoryLevel2' : '';
      return $scope.getClassForAttribute('epos', 'row', parentInstance) || defaultClass;
    };

    $scope.getClassForAccordionButton = function (parentInstance) {
      return parentInstance.isOpen ? 'fa fa-angle-down' : 'fa fa-angle-right';
    };

    $scope.shouldShowCarrierInstanceTable = function () {
      return angular.isDefined($scope.carrierInstances) && lodash.keys($scope.carrierInstances).length > 0;
    };

    $scope.toggleOpenGroup = function (parentInstance) {
      parentInstance.isOpen = angular.isDefined(parentInstance.isOpen) ? !parentInstance.isOpen : true;
    };

    function getStatusName(statusId) {
      var statusMatch = lodash.findWhere($scope.statusList, { id: statusId });
      var statusName = (!!statusMatch) ? statusMatch.statusName : '';
      if (statusName === 'Unpacking' || statusName === 'Inbound Seals') {
        statusName = 'On Floor';
      }

      return statusName;
    }

    function formatStoreInstanceForApp(storeInstance) {
      storeInstance.scheduleDate = dateUtility.formatDateForApp(storeInstance.scheduleDate, 'YYYY-MM-DD') || '';
      var stationMatch = lodash.findWhere($scope.companyStationList, { stationId: storeInstance.cateringStationId });
      storeInstance.stationCode = (!!stationMatch) ? stationMatch.stationCode : '';
      storeInstance.statusName = getStatusName(storeInstance.statusId);
    }

    function getStoreInstancesSuccess(dataFromAPI) {
      hideLoadingModal();

      var storeInstancesResponse = angular.copy(dataFromAPI.response) || [];
      var allowedStatuses = [
        'ready for packing',
        'ready for seals',
        'ready for dispatch',
        'dispatched',
        'on floor',
        'inbounded'
      ];

      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      var paginatedList = $scope.storeInstances.concat(storeInstancesResponse);
      $scope.storeInstances = lodash.filter(paginatedList, function (storeInstance) {
        formatStoreInstanceForApp(storeInstance);
        return allowedStatuses.indexOf(storeInstance.statusName.toLowerCase()) >= 0;
      });
    }

    function getStoreInstances(payload) {
      showLoadingModal('Retrieving Portal Store Instanes');
      manualECSFactory.getStoreInstanceList(payload).then(getStoreInstancesSuccess, showErrors);
      $this.meta.offset += $this.meta.limit;
    }

    function getAllIdsInAGroup(instanceGroup) {
      var idArray = instanceGroup.allIds;
      angular.forEach(instanceGroup.children, function (childInstance) {
        idArray = idArray.concat(childInstance.allIds);
      });

      return idArray;
    }

    function handleDuplicateGroups(mainGroup, duplicateGroups) {
      angular.forEach(duplicateGroups, function (duplicateGroup) {
        if (duplicateGroup.children.length === mainGroup.children.length) {
          mainGroup.allIds = mainGroup.allIds.concat(getAllIdsInAGroup(duplicateGroup));
          duplicateGroup.isDuplicate = true;
        }
      });
    }

    function handleDuplicateInstances(mainInstance, duplicateInstances) {
      angular.forEach(duplicateInstances, function (instance) {
        instance.isDuplicate = true;
        mainInstance.allIds = mainInstance.allIds.concat(instance.allIds);
      });
    }

    function findApparentDuplicates(carrierInstanceList, carrierInstance, isATiedInstance) {
      var dataToMatch = {
        instanceDate: carrierInstance.instanceDate,
        storeNumber: carrierInstance.storeNumber,
        scheduleId: carrierInstance.scheduleId,
        storeCrewNumber: carrierInstance.storeCrewNumber,
        departureStation: carrierInstance.departureStation,
        arrivalStation: carrierInstance.arrivalStation
      };

      if (isATiedInstance) {
        dataToMatch.storeInstanceId = carrierInstance.storeInstanceId;
        dataToMatch.siStoreNumber = carrierInstance.siStoreNumber;
        dataToMatch.siScheduleDate = carrierInstance.siScheduleDate;
        dataToMatch.siScheduleNumber = carrierInstance.siScheduleNumber;
        dataToMatch.siCatererStationCode = carrierInstance.siCatererStationCode;
      }

      var existingMatches = lodash.filter(carrierInstanceList, dataToMatch);
      return lodash.reject(existingMatches, { id: carrierInstance.id });
    }

    function removeApparentDuplicates(carrierInstanceList, isInstanceAGroup, isATiedECSInstanceList) {
      angular.forEach(carrierInstanceList, function (instance) {
        instance.allIds = angular.isDefined(instance.allIds) ? instance.allIds : [instance.id];
        delete instance.isDuplicate;
      });

      angular.forEach(carrierInstanceList, function (instance) {
        if (instance.isDuplicate) {
          return;
        }

        instance.isDuplicate = false;
        var matches = findApparentDuplicates(carrierInstanceList, instance, isATiedECSInstanceList);
        if (isInstanceAGroup) {
          handleDuplicateGroups(instance, matches);
        } else {
          handleDuplicateInstances(instance, matches);
        }
      });

      return lodash.filter(carrierInstanceList, { isDuplicate: false });
    }

    function formatGrouping(groupedCarrierInstanceObject) {
      var formattedCarrierInstanceList = [];
      angular.forEach(groupedCarrierInstanceObject, function (ecbGroup) {
        var groupWithNoDuplicates = removeApparentDuplicates(ecbGroup, false, false);
        var sortedGroup = lodash.sortByOrder(groupWithNoDuplicates, ['storeNumber', 'instanceDate', 'scheduleNumber'], ['asc', 'asc', 'asc']);
        var parent = sortedGroup[0];
        parent.children = lodash.drop(sortedGroup);
        formattedCarrierInstanceList.push(parent);
      });

      return removeApparentDuplicates(formattedCarrierInstanceList, true, false);
    }

    function setCarrierInstancesList(carrierInstanceListFromAPI) {
      var carrierInstanceList = lodash.uniq(angular.copy(carrierInstanceListFromAPI.response));
      angular.forEach(carrierInstanceList, function (carrierInstance) {
        carrierInstance.instanceDate = dateUtility.formatDateForApp(carrierInstance.instanceDate);
        carrierInstance.storeNumber = carrierInstance.storeNumber || '';
      });

      var groupedList = lodash.groupBy(carrierInstanceList, 'ecbGroup');
      $scope.carrierInstances = formatGrouping(groupedList);
      hideLoadingModal();
    }

    function getCompleteCarrierInstanceList(ecbGroupPayloadArray) {
      if (ecbGroupPayloadArray.length) {
        var payloadForAPI = {
          ecbGroup: (ecbGroupPayloadArray).toString()
        };
        manualECSFactory.getCarrierInstanceList(payloadForAPI).then(setCarrierInstancesList, showErrors);
        return;
      }

      $scope.carrierInstances = [];
      hideLoadingModal();
    }

    function getCarrierInstanceGroups(dataFromAPI) {
      if (!dataFromAPI.response.length) {
        hideLoadingModal();
        $scope.carrierInstances = {};
        return;
      }

      var ecbGroupPayload = [];
      angular.forEach(dataFromAPI.response, function (carrierInstance) {
        if (carrierInstance.ecbGroup !== null) {
          ecbGroupPayload.push(carrierInstance.ecbGroup);
        }
      });

      getCompleteCarrierInstanceList(lodash.uniq(ecbGroupPayload));
    }

    function getUnTiedCarrierInstances(payload) {
      payload.storeInstanceId = 0;
      showLoadingModal('Retrieving ePOS Instances');
      manualECSFactory.getCarrierInstanceList(payload).then(getCarrierInstanceGroups, showErrors);
    }

    function getTiedCarrierInstancesSuccess(dataFromAPI) {
      hideLoadingModal();
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      var paginatedList = $scope.allECSInstances.concat(angular.copy(dataFromAPI.response));
      $scope.allECSInstances = removeApparentDuplicates(lodash.uniq(angular.copy(paginatedList)), false, true);
      angular.forEach($scope.allECSInstances, function (carrierInstance) {
        carrierInstance.instanceDate = (!!carrierInstance.instanceDate) ? dateUtility.formatDateForApp(carrierInstance.instanceDate) : '';
        carrierInstance.siScheduleDate = (!!carrierInstance.siScheduleDate) ? dateUtility.formatDateForApp(carrierInstance.siScheduleDate) : '';
        if (angular.isDefined(carrierInstance.statusId)) {
          carrierInstance.statusName = getStatusName(carrierInstance.statusId);
        }
      });
    }

    function getTiedCarrierInstances(payload) {
      showLoadingModal('Retrieving ePOS Instances');
      manualECSFactory.getCarrierInstanceList(payload).then(getTiedCarrierInstancesSuccess, showErrors);
      $this.meta.offset += $this.meta.limit;
    }

    $scope.resetAll = function () {
      $scope.portalSearch = {};
      $scope.eposSearch = {};
      $scope.selectedEposRecords = [];
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

    function getArrayOfAllCarrierInstancesInGroup(groupParent) {
      var instanceArray = [];
      instanceArray.push(groupParent);
      angular.forEach(groupParent.children, function (childInstance) {
        instanceArray.push(childInstance);
      });

      return instanceArray;
    }

    $scope.getAllCarrierInstancesToSave = function () {
      var allCarrierInstances = [];
      angular.forEach($scope.selectedEposRecords, function (groupParent) {
        allCarrierInstances = allCarrierInstances.concat(getArrayOfAllCarrierInstancesInGroup(groupParent));
      });

      return allCarrierInstances;
    };

    function getAllChildIds(instanceGroup) {
      var idArray = [];
      angular.forEach(instanceGroup, function (childInstance) {
        idArray = idArray.concat(childInstance.allIds);
      });

      return idArray;
    }

    function getAllCarrierInstanceIdsToSave() {
      var idArray = [];
      angular.forEach($scope.selectedEposRecords, function (groupParent) {
        idArray = idArray.concat(groupParent.allIds);
        idArray = idArray.concat(getAllChildIds(groupParent.children));
      });

      return idArray;
    }

    function createSaveRelationshipPromise() {
      var promises = [];
      var allCarrierInstancesIds = getAllCarrierInstanceIdsToSave();
      var payload = {
        storeInstanceId: $scope.selectedPortalRecord.id,
        carrierInstancesIds: allCarrierInstancesIds
      };

      promises.push(manualECSFactory.updateCarrierInstance($scope.selectedPortalRecord.id, payload));
      
      return promises;
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

      var isArrayEmpty = (Array.isArray(arrayToCheck)) ? arrayToCheck.length <= 0 : lodash.keys(arrayToCheck).length <= 0;
      return angular.isDefined(arrayToCheck) && arrayToCheck !== null && isArrayEmpty;
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
      $scope.storeInstances = [];
      $scope.isCreateSearch = false;
    };

    $scope.clearAllInstancesSearch = function () {
      $scope.allInstancesSearch = {};
      $scope.allECSInstances = [];
      $scope.isViewSearch = false;
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
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
      searchPayload.limit = $this.meta.limit;
      searchPayload.offset = $this.meta.offset;
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
      var searchPayload = {};

      searchPayload.limit = $this.meta.limit;
      searchPayload.offset = $this.meta.offset;

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

    $scope.loadAllECSInstances = function() {
      if ($this.meta.offset >= $this.meta.count || !$scope.isViewSearch) {
        return;
      }

      var searchPayload = formatAllECSSearchPayload();
      getTiedCarrierInstances(searchPayload);
    };

    $scope.searchAllECSInstances = function () {
      $scope.isViewSearch = true;
      $scope.allECSInstances = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.loadAllECSInstances();
    };

    $scope.searchEposInstances = function () {
      $scope.selectedEposRecords = [];
      var searchPayload = formatEposSearchPayload();
      getUnTiedCarrierInstances(searchPayload);
    };

    $scope.loadPortalInstances = function() {
      if ($this.meta.offset >= $this.meta.count || !$scope.isCreateSearch) {
        return;
      }

      var searchPayload = formatPortalSearchPayload();
      getStoreInstances(searchPayload);
    };

    $scope.searchPortalInstances = function () {
      $scope.selectedPortalRecord = null;
      $scope.isCreateSearch = true;
      $scope.storeInstances = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.loadPortalInstances();
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
      makeInitPromises();
    }

    init();

  });
