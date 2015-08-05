'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:LmpDeliveryNoteCtrl
 * @description
 * # LmpDeliveryNoteCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('LmpDeliveryNoteCtrl', function ($scope, $routeParams, $location, $q, deliveryNoteFactory, dateUtility) {

    // static scope vars
    $scope.viewName = 'Delivery note';
    $scope.ullageReasons = ['FPO jus cause', 'Some reason'];

    // private vars
    var _initPromises = [];
    var _catererStationIdInitLoaded = false;
    var _companyId = deliveryNoteFactory.getCompanyId();
    var _companyMenuCatererStations = [];

    function getCatererStationList(){
      return deliveryNoteFactory.getCatererStationList(_companyId).then(setCatererStationListFromResponse);
    }

    function getDeliveryNote(){
      return deliveryNoteFactory.getDeliveryNote($routeParams.id).then(setDeliveryNoteFromResponse);
    }

    function getCompanyMenuCatererStations(){
      return deliveryNoteFactory.getCompanyMenuCatererStations().then(setCompanyMenuCatererStations);
    }

    function setCatererStationListFromResponse(response){
      $scope.catererStationList = response.response;
    }

    function setDeliveryNoteFromResponse(response){
      $scope.deliveryNote = angular.copy(response);
      $scope.deliveryNote.deliveryDate = dateUtility.formatDateForApp($scope.deliveryNote.deliveryDate);
    }

    function setCompanyMenuCatererStations(response){
      _companyMenuCatererStations = response.companyMenuCatererStations;
      // TODO - use this to get menu items
    }

    function catererStationIdWatcher(newValue, oldValue){
      if(!_catererStationIdInitLoaded){
        if(angular.isDefined(newValue) && oldValue !== newValue) {
          _catererStationIdInitLoaded = true;
        }
        return;
      }
      // TODO - watch here to query item lists based on _companyMenuCatererStations
    }

    function displayLoadingModal(loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showResponseErrors(response){
      if ('data' in response) {
        angular.forEach(response.data,function(error){
          this.push(error);
        }, $scope.formErrors);
      }
      $scope.displayError = true;
      hideLoadingModal();
    }

    function initPromisesResolved(){
      // TODO switch on state?
      hideLoadingModal();
    }

    function resolveInitPromises(){
      $q.all(_initPromises).then(initPromisesResolved, showResponseErrors);
    }

    var stateActions = {};
    stateActions.viewInit = function(){
      $scope.readOnly = true;
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      resolveInitPromises();
    };
    stateActions.createInit = function(){
      $scope.readOnly = false;
      $scope.viewName = 'Create Delivery Note';
      displayLoadingModal();
      _initPromises.push(getCatererStationList());
      _initPromises.push(getCompanyMenuCatererStations());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      resolveInitPromises();
    };
    stateActions.editInit = function(){
      $scope.readOnly = false;
      displayLoadingModal();
      _initPromises.push(getDeliveryNote());
      _initPromises.push(getCatererStationList());
      _initPromises.push(getCompanyMenuCatererStations());
      $scope.$watch('deliveryNote.catererStationId', catererStationIdWatcher);
      resolveInitPromises();
    };

    // constructor
    function init(){
      // scope vars
      $scope.state = $routeParams.state;
      $scope.displayError = false;
      $scope.formErrors = [];

      // private vars
      _initPromises = [];
      var initStateAction = $routeParams.state + 'Init';
      if(stateActions[initStateAction]){
        stateActions[initStateAction]();
      }
      else{
        $location.path('/');
      }
    }
    init();
  });
