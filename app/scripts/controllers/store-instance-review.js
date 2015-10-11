'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceReviewCtrl
 * @description
 * # StoreInstanceReviewCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceReviewCtrl', function ($scope, $routeParams, storeInstanceWizardConfig,
                                                   storeInstanceFactory, $location, storeInstanceReviewFactory, $q, ngToast, $filter, dateUtility, lodash) {

    var _initPromises = [];
    var _sealTypes = [];
    var _sealColors = [];
    var _storeInstanceSeals = [];
    var _storeOneSeals = [];
    var _nextStatusId = null;
    var _menuItems = [];
    var STATUS_END_INSTANCE = 'Unpacking';
    var MESSAGE_ACTION_NOT_ALLOWED = 'Action not allowed';
    var sealsToRemove = {
      'dispatch': [],
      'replenish': ['Hand Over'],
      'end-instance': ['Hand Over', 'Outbound'],
      'redispatch': []
    };
    var $this = this;

    $scope.saveButtonText = 'Exit';

    function showMessage(message, messageType) {
      ngToast.create({
        className: messageType,
        dismissButton: true,
        content: message
      });
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText || 'Loading');
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showResponseErrors(response) {
      if ('data' in response) {
        angular.forEach(response.data, function (error) {
          this.push(error);
        }, $scope.formErrors);
      }
      $scope.displayError = true;
      hideLoadingModal();
    }

    function getItemsSuccessHandler(dataFromAPI) {
      _menuItems = angular.copy(dataFromAPI.response);
    }

    function getStoreInstanceMenuItems() {
      var payloadDate = dateUtility.formatDateForAPI(angular.copy($scope.storeDetails.scheduleDate));
      var payload = {
        itemTypeId: 1,
        date: payloadDate
      };
      _initPromises.push(
        storeInstanceFactory.getStoreInstanceMenuItems($routeParams.storeId, payload)
          .then(getItemsSuccessHandler)
      );
    }

    function setStoreInstanceSeals(dataFromAPI) {
      _storeInstanceSeals = angular.copy(dataFromAPI.response);
    }

    function setStoreOneInstanceSeals(dataFromAPI) {
      _storeOneSeals = angular.copy(dataFromAPI.response);
    }

    function setSealColors(dataFromAPI) {
      _sealColors = angular.copy(dataFromAPI.response);
    }

    function setSealTypes(dataFromAPI) {
      _sealTypes = angular.copy(dataFromAPI);
    }

    function getSealNumbersByTypeId(sealArray, sealTypeId) {
      var seals = $filter('filter')(sealArray, {
        type: sealTypeId
      }, true);
      var sealNumbers = [];
      for (var sealKey in seals) {
        var seal = seals[sealKey];
        for (var sealNumberKey in seal.sealNumbers) {
          var sealNumber = seal.sealNumbers[sealNumberKey];
          sealNumbers.push(sealNumber);
        }
      }
      return sealNumbers;
    }

    function getSealColorByTypeId(sealTypeId) {
      var sealColor = $filter('filter')(_storeInstanceSeals, {
        type: sealTypeId
      }, true);
      if (!sealColor || !sealColor.length) {
        sealColor = $filter('filter')(_sealColors, {
          type: sealTypeId
        }, true);
      }
      return sealColor[0].color;
    }

    function getMenuQuantity(itemMasterId) {
      var masterItem = $filter('filter')(_menuItems, {
        itemMasterId: itemMasterId
      }, true);
      if (!masterItem || !masterItem.length) {
        return 0;
      }
      return masterItem[0].menuQuantity;
    }

    function isRedispatch() {
      return $routeParams.action === 'redispatch';
    }

    function addSealToScope(sealType) {
      $scope.seals.push({
        name: sealType.name,
        bgColor: getSealColorByTypeId(sealType.id),
        sealNumbers: getSealNumbersByTypeId(_storeInstanceSeals, sealType.id)
      });

      if (isRedispatch()) {
        $scope.storeOneSeals.push({
          name: sealType.name,
          bgColor: getSealColorByTypeId(sealType.id),
          sealNumbers: getSealNumbersByTypeId(_storeOneSeals, sealType.id)
        });
      }
    }

    function removeSealNotUsed(sealsArray) {
      return sealsArray.filter(function (sealType) {
        return sealsToRemove[$routeParams.action].indexOf(sealType.name) < 0;
      });
    }

    $scope.removeSealsForStoreOne = function (seal) {
      return sealsToRemove['end-instance'].indexOf(seal.name) < 0;
    };

    function setSealsList() {
      $scope.seals = [];
      $scope.storeOneSeals = [];

      _sealTypes = removeSealNotUsed(_sealTypes);
      _sealTypes.map(function (sealType) {
        addSealToScope(sealType);
        return _sealTypes;
      });
    }

    function setPackingSection() {
      $scope.pickListItems = [];
      $scope.offloadItemList = [];
      angular.forEach($scope.storeOneItemList, function (item) {
        var storeTwoItem = lodash.findWhere($scope.items, {
          itemMasterId: item.itemMasterId
        });
        if (storeTwoItem) {
          $scope.pickListItems.push(angular.merge(item, storeTwoItem));
          lodash.remove($scope.items, storeTwoItem);
        } else {
          $scope.offloadItemList.push(item);
        }
      });

      if (angular.isArray($scope.items)) {
        $scope.pickListItems.concat($scope.items);
      }

      $scope.pickListItems.map(function (item) {
        item.pickedQuantity = item.dispatchedQuantity - item.quantity;
      });
    }

    function getStepsForStoreOne() {
      $scope.prevInstanceWizardSteps = storeInstanceWizardConfig.getSteps('end-instance', $routeParams.storeId);
      var currentStepIndex = lodash.findIndex($scope.prevInstanceWizardSteps, {
        controllerName: 'Packing'
      });
      $this.prevInstancePrevStep = angular.copy($scope.prevInstanceWizardSteps[currentStepIndex - 1]);
    }

    function initLoadComplete() {
      hideLoadingModal();
      setSealsList();
      if (isRedispatch()) {
        setPackingSection();
        getStepsForStoreOne();
      }
    }

    function showUserCurrentStatus() {
      hideLoadingModal();
      var action = 'dispatched';
      if ($routeParams.action === 'replenish') {
        action = 'replenished';
      }
      showMessage('Store Instance ' + $routeParams.storeId + ' has been ' + action + '!', 'success');
    }

    function getStoreInstanceSeals() {
      _initPromises.push(
        storeInstanceReviewFactory.getStoreInstanceSeals($routeParams.storeId)
          .then(setStoreInstanceSeals)
      );

      if (isRedispatch() && $scope.storeDetails.prevStoreInstanceId) {
        _initPromises.push(
          storeInstanceReviewFactory.getStoreInstanceSeals($scope.storeDetails.prevStoreInstanceId)
            .then(setStoreOneInstanceSeals)
        );
      }

      _initPromises.push(
        storeInstanceReviewFactory.getSealColors()
          .then(setSealColors)
      );
      _initPromises.push(
        storeInstanceReviewFactory.getSealTypes()
          .then(setSealTypes)
      );
    }

    function getStatusNameIntByName(name) {
      var status = $filter('filter')($scope.storeDetails.statusList, {
        statusName: name
      }, true);
      if (!status || !status.length) {
        return false;
      }
      return status[0].name;
    }

    function throwError(field, message) {
      if (!message) {
        message = MESSAGE_ACTION_NOT_ALLOWED;
      }
      var error = {
        data: [{
          field: field,
          value: message
        }]
      };
      showResponseErrors(error);
    }

    function storeInstanceStatusDispatched(response) {
      hideLoadingModal();
      if (angular.isArray(response)) {
        response = response[0];
      }
      $scope.storeDetails.currentStatus = $filter('filter')($scope.storeDetails.statusList, {
        id: response.statusId
      }, true)[0];
      showUserCurrentStatus();
      $location.url('/store-instance-dashboard');
    }

    function checkOnValidStatus() {
      var validStatusList = {
        'dispatch': 'Ready for Dispatch',
        'replenish': 'Ready for Dispatch',
        'end-instance': 'Unpacking',
        'redispatch': 'Unpacking'
      };

      if ($scope.storeDetails.currentStatus.statusName !== validStatusList[$routeParams.action]) {
        throwError('Wrong Status');
        $scope.actionNotAllowed = true;
      }
    }

    $scope.isEndInstance = function () {
      if ($scope.storeDetails) {
        return $scope.storeDetails.currentStatus.statusName === STATUS_END_INSTANCE;
      }
    };

    function mergeInboundUllageItems(rawItemList) {
      var inboundItemList = rawItemList.filter(function (item) {
        return item.countTypeId === lodash.findWhere($this.countTypes, {
            name: 'Offload'
          }).id;
      });

      var ullageItemList = rawItemList.filter(function (item) {
        return item.countTypeId === lodash.findWhere($this.countTypes, {
            name: 'Ullage'
          }).id;
      });

      ullageItemList.map(function (item) {
        item.ullageQuantity = item.quantity;
        delete item.quantity;
      });

      return angular.merge(inboundItemList, ullageItemList);
    }

    function getDispatchedItemList(rawItemList, filteredItems) {
      var dispatchedItemList = rawItemList.filter(function (item) {
        return item.countTypeId === lodash.findWhere($this.countTypes, {
            name: 'Warehouse Open'
          }).id;
      });

      dispatchedItemList.map(function (item) {
        item.dispatchedQuantity = item.quantity;
        delete item.quantity;
      });

      return angular.merge(dispatchedItemList, filteredItems);
    }

    function formatItems(itemArray, excludeMenuQty) {
      itemArray.map(function (item) {
        item.itemDescription = item.itemCode + ' -  ' + item.itemName;
        item.disabled = true;

        if (!excludeMenuQty) {
          item.menuQuantity = getMenuQuantity(item.itemMasterId);
        }
      });
      return itemArray;
    }

    function setStoreInstanceItems(dataFromAPI) {
      var rawItemList = angular.copy(dataFromAPI.response);
      var mergedItems = ($scope.isEndInstance() ? mergeInboundUllageItems(rawItemList) : rawItemList);
      if (isRedispatch()) {
        mergedItems = getDispatchedItemList(rawItemList, mergedItems);
      }
      $scope.items = formatItems(mergedItems);
    }

    function setStoreOneItemList(dataFromAPI) {
      var mergedItems = mergeInboundUllageItems(angular.copy(dataFromAPI.response));
      mergedItems.map(function (item) {
        item.itemDescription = item.itemCode + ' -  ' + item.itemName;
      });
      $scope.storeOneItemList = formatItems(mergedItems, true);
    }

    function getStoreInstanceItems() {
      _initPromises.push(
        storeInstanceFactory.getStoreInstanceItemList($routeParams.storeId).then(setStoreInstanceItems)
      );
      if (isRedispatch() && $scope.storeDetails.prevStoreInstanceId) {
        _initPromises.push(
          storeInstanceFactory.getStoreInstanceItemList($scope.storeDetails.prevStoreInstanceId).then(
            setStoreOneItemList)
        );
      }
    }

    function getStoreInstanceReviewData() {
      getStoreInstanceItems();
      getStoreInstanceMenuItems();
      getStoreInstanceSeals();
      $q.all(_initPromises).then(initLoadComplete, showResponseErrors);
    }

    $scope.getUllageReason = function (ullageReasonCode) {
      if (ullageReasonCode) {
        return $filter('filter')($scope.ullageReasonList, {
          id: ullageReasonCode
        }, true)[0].companyReasonCodeName;
      }
    };

    function storeDetailsResponseHandler(responseArray) {
      $scope.storeDetails = angular.copy(responseArray[0]);
      $scope.ullageReasonList = angular.copy(responseArray[1].companyReasonCodes);
      $this.countTypes = angular.copy(responseArray[2]);
      checkOnValidStatus();
      getStoreInstanceReviewData();
    }

    function saveStoreStatusIfRedispatch(status) {
      var statusNameArray = [getStatusNameIntByName(status[0]), getStatusNameIntByName(status[1])];
      var statusPromise = [];
      statusPromise.push(storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusNameArray[0]));
      statusPromise.push(storeInstanceFactory.updateStoreInstanceStatus($scope.storeDetails.prevStoreInstanceId,
        statusNameArray[1]));
      $q.all(statusPromise).then(storeInstanceStatusDispatched, showResponseErrors);
    }

    function saveStoreInstanceStatus(status) {
      $scope.formErrors = [];
      displayLoadingModal();
      if (isRedispatch() && $scope.storeDetails.prevStoreInstanceId && angular.isArray(status)) {
        saveStoreStatusIfRedispatch(status);
        return;
      }
      var statusNameInt = getStatusNameIntByName(status);
      if (!status) {
        throwError('statusId', 'Unable to find statusId by name: ' + name);
        return false;
      }
      storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusNameInt).then(
        storeInstanceStatusDispatched, showResponseErrors);
    }

    function setupSteps() {
      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);
      var currentStepIndex = lodash.findIndex($scope.wizardSteps, {
        controllerName: 'Review'
      });
      $this.prevStep = angular.copy($scope.wizardSteps[currentStepIndex - 1]);
    }

    function getDataFromAPI() {
      var promiseArray = [];
      displayLoadingModal();
      setupSteps();
      promiseArray.push(storeInstanceFactory.getStoreDetails($routeParams.storeId));
      promiseArray.push(storeInstanceFactory.getReasonCodeList());
      promiseArray.push(storeInstanceFactory.getCountTypes());

      $q.all(promiseArray).then(storeDetailsResponseHandler, showResponseErrors);
    }

    this.updateInstanceToByStepName = function (stepObject, storeIdToUpdate) {
      if (angular.isUndefined(stepObject)) {
        $location.url('/store-instance-dashboard');
        return;
      }
      storeInstanceFactory.updateStoreInstanceStatus(storeIdToUpdate || $routeParams.storeId, stepObject.stepName).then(function () {
        if (!storeIdToUpdate) {
          $location.url(stepObject.uri);
        }
      }, showResponseErrors);
    };

    $scope.stepWizardPrevTrigger = function () {
      displayLoadingModal();
      $scope.showLoseDataAlert = false;
      var wizardStep = $scope.wizardSteps[$scope.wizardStepToIndex] || $this.prevStep;
      $this.updateInstanceToByStepName(wizardStep);

      if (isRedispatch() && $scope.storeDetails.prevStoreInstanceId) {
        var prevInstancePrevStep = $scope.prevInstanceWizardSteps[$scope.wizardStepToIndex] || $this.prevInstancePrevStep;
        $this.updateInstanceToByStepName(prevInstancePrevStep, $scope.storeDetails.prevStoreInstanceId, false);
      }

      return false;
    };

    $scope.storeInstancePreviousStep = function () {
      displayLoadingModal();
      $this.updateInstanceToByStepName($this.prevStep);
    };

    $scope.redirectTo = function (controllerName) {
      if (!controllerName) {
        return;
      }
      var step = lodash.findWhere($scope.wizardSteps, {
        controllerName: controllerName
      }, true);
      $this.updateInstanceToByStepName(step);
    };

    $scope.loseDataAlertConfirmTrigger = function () {
      var stepName = $scope.wizardSteps[$scope.wizardStepToIndex].stepName;
      $this.updateInstanceToByStepName(stepName);
    };

    $scope.submit = function () {
      var submitStatus = {
        'dispatch': 'Dispatched',
        'replenish': 'Dispatched',
        'end-instance': 'Inbounded',
        'redispatch': ['Inbounded', 'Dispatched']
      };

      if (submitStatus[$routeParams.action]) {
        saveStoreInstanceStatus(submitStatus[$routeParams.action]);
      }
    };

    $scope.exit = function () {
      $location.url('/store-instance-dashboard');
    };

    $scope.hasDiscrepancy = function (item) {
      if ($routeParams.action !== 'dispatch') {
        return '';
      }
      return (item.menuQuantity !== item.quantity) ? 'danger' : '';
    };

    $scope.getTitleFor = function (section) {
      var titles = {
        seals: {
          'dispatch': 'Seal Number Assignment',
          'replenish': 'Seal Number Assignment',
          'end-instance': 'Inbound Seals'
        },
        items: {
          'dispatch': 'Pick List',
          'replenish': 'Pick List',
          'end-instance': 'Offload List'
        },
        dispatch: {
          'dispatch': 'Dispatch',
          'replenish': 'Dispatch',
          'end-instance': 'End Instance'
        }
      };

      if (!titles[section] || !titles[section][$routeParams.action]) {
        return '';
      }

      return titles[section][$routeParams.action];
    };

    function init() {
      _initPromises = [];
      _sealTypes = [];
      _sealColors = [];
      _storeInstanceSeals = [];
      _nextStatusId = null;

      $scope.displayError = false;
      $scope.formErrors = [];
      $scope.action = $routeParams.action;

      getDataFromAPI();

    }

    init();
  });
