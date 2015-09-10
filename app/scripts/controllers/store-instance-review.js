'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceReviewCtrl
 * @description
 * # StoreInstanceReviewCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceReviewCtrl', function ($scope, $routeParams, storeInstanceDispatchWizardConfig,
                                                   storeInstanceFactory, $location, storeInstanceReviewFactory,
                                                   $q, ngToast, $filter) {

    var _initPromises = [];
    var _sealTypes = [];
    var _sealColors = [];
    var _storeInstanceSeals = [];

    function showMessage(message, messageType) {
      ngToast.create({className: messageType, dismissButton: true, content: '<strong>Store Instance Review</strong>: ' + message});
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

    $scope.stepWizardPrevTrigger = function(){
      $scope.showLoseDataAlert = true;
      return false;
    };

    $scope.goToWizardStep = function($index){
      $scope.wizardStepToIndex = $index;
      $scope.stepWizardPrevTrigger();
    };

    $scope.loseDataAlertConfirmTrigger = function(){
      var uri = $scope.wizardSteps[$scope.wizardStepToIndex].uri;
      $location.url(uri);
    };

    function getItemsSuccessHandler(dataFromAPI) {
      $scope.menuItems = dataFromAPI.response;
    }

    function getStoreInstanceMenuItems() {
      var payload = {
        itemTypeId: 1,
        scheduleDate: $scope.storeDetails.scheduleDate
      };
      _initPromises.push(
        storeInstanceFactory.getStoreInstanceMenuItems($scope.storeId, payload)
          .then(getItemsSuccessHandler)
      );
    }

    function setStoreInstanceSeals(dataFromAPI){
      _storeInstanceSeals = dataFromAPI.response;
    }

    function setSealColors(dataFromAPI){
      _sealColors = dataFromAPI.response;
    }

    function setSealTypes(dataFromAPI){
      _sealTypes = dataFromAPI;
    }

    function getSealNumbersByTypeId(sealTypeId){
      var seals = $filter('filter')(_storeInstanceSeals, {type: sealTypeId}, true);
      var sealNumbers = [];
      for(var i in seals){
        for(var j in seals[i].sealNumbers){
          sealNumbers.push(seals[i].sealNumbers[j]);
        }
      }
      return sealNumbers;
    }

    function initPromisesResolved(){
      $scope.menuItems.map(function(item){
        item.itemDescription = item.itemCode + ' -  ' + item.itemName;
        item.disabled = true;
      });
      $scope.seals = [];
      _sealTypes.map(function(sealType){
        $scope.seals.push({
          name: sealType.name,
          bgColor: $filter('filter')(_sealColors, {type: sealType.id}, true)[0].color,
          sealNumbers: getSealNumbersByTypeId(sealType.id)
        });
        return _sealTypes;
      });
      hideLoadingModal();
      showMessage('Data loaded', 'info');
    }

    function getStoreInstanceSeals() {
      _initPromises.push(
        storeInstanceReviewFactory.getStoreInstanceSeals($scope.storeId)
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

    function resolveGetStoreDetails(dataFromAPI) {
      $scope.storeDetails = dataFromAPI;
      getStoreInstanceMenuItems();
      getStoreInstanceSeals();
      $q.all(_initPromises).then(initPromisesResolved, showResponseErrors);
    }

    function init() {
      _initPromises = [];
      _sealTypes = [];
      _sealColors = [];
      _storeInstanceSeals = [];

      $scope.displayError = false;
      $scope.formErrors = [];
      $scope.storeId = $routeParams.storeId;
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($scope.storeId);

      displayLoadingModal();
      storeInstanceFactory.getStoreDetails($scope.storeId).then(resolveGetStoreDetails, showResponseErrors);
    }
    init();

  });
