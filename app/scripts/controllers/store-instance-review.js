'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceReviewCtrl
 * @description
 * # StoreInstanceReviewCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceReviewCtrl', function ($scope, $routeParams, storeInstanceWizardConfig, $window,
                                                   storeInstanceFactory, $location, storeInstanceReviewFactory, $q, ngToast, $filter, dateUtility, lodash, ENV) {

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
        var storeTwoItem = lodash.findWhere($scope.storeTwoItemList, {
          itemMasterId: item.itemMasterId
        });
        if (storeTwoItem) {
          delete storeTwoItem.ullageReasonCode;
          delete storeTwoItem.inboundQuantity;
          delete storeTwoItem.ullageQuantity;
          $scope.pickListItems.push(angular.merge(item, storeTwoItem));
          lodash.remove($scope.storeTwoItemList, storeTwoItem);
        } else {
          $scope.offloadItemList.push(item);
        }
      });
      if (angular.isArray($scope.storeTwoItemList)) {
        $scope.storeTwoItemList.map(function (item) {
          console.log(item);
          item.quantity = 0;
        });
        $scope.pickListItems = $scope.pickListItems.concat($scope.storeTwoItemList);
      }

      $scope.pickListItems.map(function (item) {
        item.pickedQuantity = (item.dispatchedQuantity + (item.ullageQuantity || 0)) - (item.inboundQuantity || 0);
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

      $window.open(ENV.apiUrl + '/api/dispatch/store-instances/documents/C208-' + $routeParams.storeId +
        '.pdf?sessionToken=' + '9e85ffbb3b92134fbf39a0c366bd3f12f0f5', '_blank');

      $location.path('store-instance-dashboard');
    }

    function checkOnValidStatus() {
      var validStatusList = {
        'dispatch': 'Ready for Dispatch',
        'replenish': 'Ready for Dispatch',
        'end-instance': 'Unpacking',
        'redispatch': 'Ready for Dispatch'
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
// TODO on redispatch, show ullageReason and offload list is missing
    function mergeInboundUllageItems(rawItemList) {
      var inboundItemList = rawItemList.filter(function (item) {
        return item.countTypeId === lodash.findWhere($this.countTypes, {
            name: 'Offload'
          }).id;
      });

      var pickedInboundItemList = rawItemList.filter(function (item) {
        return item.countTypeId === lodash.findWhere($this.countTypes, {
            name: 'Warehouse Close'
          }).id;
      });

      var ullageItemList = rawItemList.filter(function (item) {
        return item.countTypeId === lodash.findWhere($this.countTypes, {
            name: 'Ullage'
          }).id;
      });

      pickedInboundItemList.map(function (item) {
        item.inboundQuantity = item.quantity;
        delete item.quantity;
      });

      ullageItemList.map(function (item) {
        item.ullageQuantity = item.quantity;
        item.ullageCode = item.ullageReasonCode;
        delete item.quantity;
      });

      return angular.merge(inboundItemList, ullageItemList, pickedInboundItemList);
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

    /*
     store 1 - pick list, inbound quantity --> warehouse close
     store 1 - pick list, ullage quantity --> ullage
     store 2 - pick list, dispatched quantity -->  warehouse Open

     store 1 - offload list, inbound quantity --> offload
     store 1 - offload list, ullage quantity --> ullage
     */
    function formatStoreTwoItems(rawItemList) {
      var dispatchedCountTypeId = lodash.findWhere($this.countTypes, {
        name: 'Warehouse Open'
      }).id;

      var inboundCountTypeId = lodash.findWhere($this.countTypes, {
        name: 'Offload'
      }).id;

      var ullageCountTypeId = lodash.findWhere($this.countTypes, {
        name: 'Ullage'
      }).id;


      var cleanItemList = [];
      var uniqueStoreTwoItems = lodash.uniq(rawItemList, 'itemMasterId');
      uniqueStoreTwoItems.map(function (item) {
        var newItem = {
          itemMasterId: item.itemMasterId,
          itemDescription: item.itemCode + ' -  ' + item.itemName,
          disabled: true,
          menuQuantity: getMenuQuantity(item.itemMasterId)
        };

        var dispatchedItem = lodash.findWhere(rawItemList, {itemMasterId: item.itemMasterId, countTypeId: dispatchedCountTypeId});
        if (dispatchedItem) {
          newItem.dispatchedQuantity = dispatchedItem.quantity;
        }

        var inboundItem = lodash.findWhere(rawItemList, {itemMasterId: item.itemMasterId, countTypeId: inboundCountTypeId});
        if (inboundItem) {
          newItem.inboundQuantity = inboundItem.quantity;
        }

        var ullageItem = lodash.findWhere(rawItemList, {itemMasterId: item.itemMasterId, countTypeId: ullageCountTypeId});
        if (ullageItem) {
          newItem.ullageQuantity = ullageItem.quantity;
          newItem.ullageReasonCode = ullageItem.ullageReasonCode;
        }

        cleanItemList.push(newItem);
      });
      return cleanItemList;
    }

    function formatStoreOneItems(rawItemList) {
      var inboundCountTypeId = lodash.findWhere($this.countTypes, {
        name: 'Warehouse Close'
      }).id;
      var ullageCountTypeId = lodash.findWhere($this.countTypes, {
        name: 'Ullage'
      }).id;
      var offloadInboundCountTypeId = lodash.findWhere($this.countTypes, {
        name: 'Offload'
      }).id;

      var cleanItemList = [];
      var uniqueStoreOneItems = lodash.uniq(rawItemList, 'itemMasterId');
      uniqueStoreOneItems.map(function (item) {
        var newItem = {
          itemMasterId: item.itemMasterId,
          itemDescription: item.itemCode + ' -  ' + item.itemName,
          disabled: true
        };

        var inboundItem = lodash.findWhere(rawItemList, {itemMasterId: item.itemMasterId, countTypeId: inboundCountTypeId});
        if (inboundItem) {
          newItem.inboundQuantity = inboundItem.quantity;
        }

        var ullageItem = lodash.findWhere(rawItemList, {itemMasterId: item.itemMasterId, countTypeId: ullageCountTypeId});
        if (ullageItem) {
          newItem.ullageQuantity = ullageItem.quantity;
          newItem.ullageReasonCode = ullageItem.ullageReasonCode;
        }

        var offloadInboundItem = lodash.findWhere(rawItemList, {itemMasterId: item.itemMasterId, countTypeId: offloadInboundCountTypeId});
        if (offloadInboundItem) {
          newItem.offloadInboundQuantity = offloadInboundItem.quantity;
        }

        cleanItemList.push(newItem);
      });
      return cleanItemList;
    }

    function setStoreInstanceItems(dataFromAPI) {
      var rawItemList = angular.copy(dataFromAPI.response);
      var mergedItems = ($scope.isEndInstance() ? mergeInboundUllageItems(rawItemList) : rawItemList);
      if (isRedispatch()) {
        $scope.storeTwoItemList = formatStoreTwoItems(rawItemList);
      }
      $scope.items = formatItems(mergedItems);
    }

    function setStoreOneItemList(dataFromAPI) {
      $scope.storeOneItemList = formatStoreOneItems(angular.copy(dataFromAPI.response));
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
      statusPromise.push(storeInstanceFactory.updateStoreInstanceStatus($scope.storeDetails.prevStoreInstanceId,
        statusNameArray[0]));
      statusPromise.push(storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusNameArray[1]));
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

    this.updateInstanceToByStepName = function (stepObject) {
      if (!stepObject) {
        $location.url('/store-instance-dashboard');
        return;
      }

      var statusUpdatePromiseArray = [];
      statusUpdatePromiseArray.push(storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, stepObject.stepName));
      if (isRedispatch() && $scope.storeDetails.prevStoreInstanceId) {
        statusUpdatePromiseArray.push(storeInstanceFactory.updateStoreInstanceStatus($scope.storeDetails.prevStoreInstanceId, stepObject.storeOne.stepName));
      }

      $q.all(statusUpdatePromiseArray).then(function () {
        $location.url(stepObject.uri);
      }, showResponseErrors);

    };

    $scope.stepWizardPrevTrigger = function () {
      displayLoadingModal();
      $scope.showLoseDataAlert = false;
      var wizardStep = $scope.wizardSteps[$scope.wizardStepToIndex] || $this.prevStep;
      $this.updateInstanceToByStepName(wizardStep);
      return false;
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
      var pickedQuantity = item.quantity;
      if (!$routeParams.action.contains('dispatch')) {
        return '';
      }

      if ($routeParams.action === 'redispatch') {
        pickedQuantity = item.pickedQuantity;
      }
      return (item.menuQuantity !== pickedQuantity) ? 'danger' : '';
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
