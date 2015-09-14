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
    var _storeStatusList = [];
    var _nextStatusId = null;

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

    function getItemsSuccessHandler(dataFromAPI) {
      $scope.menuItems = dataFromAPI.response;
    }

    function getStoreInstanceMenuItems() {
      var payload = {
        itemTypeId: 1,
        scheduleDate: $scope.storeDetails.scheduleDate
      };
      _initPromises.push(
        storeInstanceFactory.getStoreInstanceMenuItems($routeParams.storeId, payload)
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
      for(var sealKey in seals){
        var seal = seals[sealKey];
        for(var sealNumberKey in seal.sealNumbers){
          var sealNumber = seal.sealNumbers[sealNumberKey];
          sealNumbers.push(sealNumber);
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

    function setStoreStatusList(dataFromAPI){
      _storeStatusList = dataFromAPI.response;
    }

    function getStoreStatusList(){
      /*
       _initPromises.push(
        recordsService.getStoreStatusList
          .then(setStoreStatusList);
       );
       */
      // TODO Hookup API here recordsService.getStoreStatusList
      var mockResponse = {response: [
        {
          id: 1,
          statusName: 'Ready for Packing',
          name: '1'
        },
        {
          id: 2,
          statusName: 'Ready for Seals',
          name: '2'
        },
        {
          id: 3,
          statusName: 'Ready for Dispatch',
          name: '3'
        },
        {
          id: 7,
          statusName: 'Dispatched',
          name: '4'
        },
        {
          id: 8,
          statusName: 'Un-dispatched',
          name: '7'
        },
        {
          id: 9,
          statusName: 'Inbounded',
          name: '6'
        },
        {
          id: 10,
          statusName: 'On Floor',
          name: '5'
        }
      ]};
      setStoreStatusList(mockResponse);
    }

    function resolveGetStoreDetails(dataFromAPI) {
      $scope.storeDetails = dataFromAPI;
      getStoreInstanceMenuItems();
      getStoreInstanceSeals();
      getStoreStatusList();
      $q.all(_initPromises).then(initPromisesResolved, showResponseErrors);
    }

    function resolveUpdateStoreInstanceStatus(){
      showMessage('Success, <a href="http://www.youtube.com/watch?v=OWmaoQWX6Ws&t=1m25s" target="_blank">QUICK CLICK HERE!</a>', 'info');
      // TODO redirect user somewhere?
    }

    function getStatusIdByName(name){
      var status = $filter('filter')(_storeStatusList, {statusName: name}, true);
      if(!status || !status.length){
        return false;
      }
      return status[0].id;
    }

    function init() {
      _initPromises = [];
      _sealTypes = [];
      _sealColors = [];
      _storeInstanceSeals = [];
      _storeStatusList = [];
      _nextStatusId = null;

      $scope.displayError = false;
      $scope.formErrors = [];
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($routeParams.storeId);

      displayLoadingModal();
      storeInstanceFactory.getStoreDetails($routeParams.storeId).then(resolveGetStoreDetails, showResponseErrors);
    }
    init();

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

    $scope.submit = function(){
      $scope.formErrors = [];
      var statusId = getStatusIdByName('Dispatched');
      if(!statusId){
        var error = {
          data: [{
            field: 'statusId',
            value: 'Fatal Error. Unable to find statusId of statusName "Dispatched"'
          }]
        };
        showResponseErrors(error);
        return false;
      }
      // TODO begin remove
      resolveUpdateStoreInstanceStatus();
      return;
      // TODO end remove
      /*
      storeInstanceFactory.updateStoreInstanceStatus($routeParams.storeId, statusId)
        .then(resolveUpdateStoreInstanceStatus, showResponseErrors);
        */
    };

  });
