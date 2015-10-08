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
                                                   storeInstanceFactory, $location, storeInstanceReviewFactory,
                                                   $q, ngToast, $filter, dateUtility) {

    var _initPromises = [];
    var _sealTypes = [];
    var _sealColors = [];
    var _storeInstanceSeals = [];
    var _nextStatusId = null;
    var _menuItems = [];
    var STATUS_END_INSTANCE = 'Unpacking';
    var MESSAGE_ACTION_NOT_ALLOWED = 'Action not allowed';
    var actions = {};
    var $this = this;

    $scope.saveButtonText = 'Exit';

    function showMessage(message, messageType) {
      ngToast.create({className: messageType, dismissButton: true, content: message});
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

    function setSealColors(dataFromAPI) {
      _sealColors = angular.copy(dataFromAPI.response);
    }

    function setSealTypes(dataFromAPI) {
      _sealTypes = angular.copy(dataFromAPI);
    }

    function getSealNumbersByTypeId(sealTypeId) {
      var seals = $filter('filter')(_storeInstanceSeals, {type: sealTypeId}, true);
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
      var sealColor = $filter('filter')(_storeInstanceSeals, {type: sealTypeId}, true);
      if (!sealColor || !sealColor.length) {
        sealColor = $filter('filter')(_sealColors, {type: sealTypeId}, true);
      }
      return sealColor[0].color;
    }

    function getMenuQuantity(itemMasterId) {
      var masterItem = $filter('filter')(_menuItems, {itemMasterId: itemMasterId}, true);
      if (!masterItem || !masterItem.length) {
        return 0;
      }
      return masterItem[0].menuQuantity;
    }

    function addSealToScope(sealType) {
      $scope.seals.push({
        name: sealType.name,
        bgColor: getSealColorByTypeId(sealType.id),
        sealNumbers: getSealNumbersByTypeId(sealType.id)
      });
    }

    function removeSealNotUsed(sealsArray) {
      var itemsToRemove = {
        'dispatch': [],
        'replenish': ['Hand Over'],
        'end-instance': ['Hand Over', 'Outbound']
      };
      return sealsArray.filter(function (sealType) {
        return itemsToRemove[$routeParams.action].indexOf(sealType.name) < 0;
      });
    }

    function setSealsList() {
      $scope.seals = [];

      _sealTypes = removeSealNotUsed(_sealTypes);
      _sealTypes.map(function (sealType) {
        addSealToScope(sealType);
        return _sealTypes;
      });
    }

    function initLoadComplete() {
      hideLoadingModal();
      setSealsList();
    }

    function showUserCurrentStatus() {
      hideLoadingModal();
      var action = 'dispatched';
      if ($routeParams.action === 'replenish') {
        action = 'replenished';
      }
      showMessage('Store Instance ' + $routeParams.storeId + 'has been ' + action + '!', 'success');
    }

    function getStoreInstanceSeals() {
      _initPromises.push(
        storeInstanceReviewFactory.getStoreInstanceSeals($routeParams.storeId)
          .then(setStoreInstanceSeals)
      );
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
      var status = $filter('filter')($scope.storeDetails.statusList, {statusName: name}, true);
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
      $scope.storeDetails.currentStatus = $filter('filter')($scope.storeDetails.statusList, {id: response.statusId}, true)[0];
      showUserCurrentStatus();
      $location.url('/store-instance-dashboard');
    }

    function checkOnValidStatus() {
      var validStatusList = {
        'dispatch': 'Ready for Dispatch',
        'replenish': 'Ready for Dispatch',
        'end-instance': 'Unpacking'
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
        return item.countTypeId === 14;
      });

      var ullageItemList = rawItemList.filter(function (item) {
        return item.countTypeId === 7;
      });

      ullageItemList.map(function (item) {
        item.ullageQuantity = item.quantity;
        delete item.quantity;
      });

      return angular.merge(inboundItemList, ullageItemList);
    }

    function formatItems() {
      $scope.items.map(function (item) {
        item.itemDescription = item.itemCode + ' -  ' + item.itemName;
        item.disabled = true;
        if (!$scope.isEndInstance()) {
          item.menuQuantity = getMenuQuantity(item.itemMasterId);
        }
      });
    }

    function setStoreInstanceItems(dataFromAPI) {
      var rawItemList = angular.copy(dataFromAPI.response);
      $scope.items = $scope.isEndInstance() ? mergeInboundUllageItems(rawItemList) : rawItemList;
      formatItems();
    }

    function getStoreInstanceItems() {
      _initPromises.push(
        storeInstanceFactory.getStoreInstanceItemList($routeParams.storeId).then(setStoreInstanceItems)
      );
    }

    function getStoreInstanceReviewData() {
      getStoreInstanceItems();
      getStoreInstanceMenuItems();
      getStoreInstanceSeals();
      $q.all(_initPromises).then(initLoadComplete, showResponseErrors);
    }

    $scope.getUllageReason = function (ullageReasonCode) {
      if (ullageReasonCode) {
        return $filter('filter')($scope.ullageReasonList, {id: ullageReasonCode}, true)[0].companyReasonCodeName;
      }
    };

    function storeDetailsResponseHandler(responseArray) {
      $scope.storeDetails = angular.copy(responseArray[0]);
      $scope.ullageReasonList = angular.copy(responseArray[1].companyReasonCodes);
      checkOnValidStatus();
      getStoreInstanceReviewData();
    }

    function saveStoreInstanceStatus(status) {
      $scope.formErrors = [];
      var statusNameInt = getStatusNameIntByName(status);
      if (!statusNameInt) {
        throwError('statusId', 'Unable to find statusId by name: ' + name);
        return false;
      }
      displayLoadingModal();
      storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusNameInt).then(
        storeInstanceStatusDispatched, showResponseErrors);
    }

    function getDataFromAPI() {
      var promiseArray = [];
      displayLoadingModal();
      $scope.wizardSteps = storeInstanceWizardConfig.getSteps($routeParams.action, $routeParams.storeId);

      promiseArray.push(storeInstanceFactory.getStoreDetails($routeParams.storeId));
      promiseArray.push(storeInstanceFactory.getReasonCodeList());

      $q.all(promiseArray).then(storeDetailsResponseHandler, showResponseErrors);
    }


    actions.dispatchPrevStepIndex = 2;
    actions.replenishPrevStepIndex = 2;

    this.updateInstanceToByStepName = function (stepName) {
      if (angular.isUndefined(stepName)) {
        $location.url('/store-instance-dashboard');
        return;
      }
      storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, stepName).then(function () {
        var uri = $scope.wizardSteps[$scope.wizardStepToIndex].uri;
        $location.url(uri);
      }, showResponseErrors);
    };

    $scope.stepWizardPrevTrigger = function () {
      $scope.showLoseDataAlert = false;
      if (angular.isUndefined($scope.wizardStepToIndex)) {
        var prevStepAction = $routeParams.action + 'PrevStepIndex';
        if (actions[prevStepAction]) {
          $scope.wizardStepToIndex = actions[prevStepAction];
        }
      }
      var stepName = $scope.wizardSteps[$scope.wizardStepToIndex].stepName;
      $this.updateInstanceToByStepName(stepName);
      return false;
    };

    $scope.goToWizardStep = function ($index) {
      $scope.wizardStepToIndex = $index;
      if (!$scope.wizardSteps[$scope.wizardStepToIndex]) {
        return;
      }
      var stepName = $scope.wizardSteps[$scope.wizardStepToIndex].stepName;
      $this.updateInstanceToByStepName(stepName);
    };

    $scope.loseDataAlertConfirmTrigger = function () {
      var stepName = $scope.wizardSteps[$scope.wizardStepToIndex].stepName;
      $this.updateInstanceToByStepName(stepName);
    };

    $scope.submit = function () {
      var submitStatus = {
        'dispatch': 'Dispatched',
        'replenish': 'Dispatched',
        'end-instance': 'Inbounded'
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
