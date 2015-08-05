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
    $scope.fpo = {
      ullageReasons: ['jus cause', 'Some reason']
    };

    // private vars
    var _initPromises = [];

    function getDeliveryNote(){
      displayLoadingModal();
      _initPromises.push(deliveryNoteFactory.getDeliveryNote($routeParams.id).then(setDeliveryNote, showResponseErrors));
    }

    function setDeliveryNote(response){
      $scope.deliveryNote = angular.copy(response);
      $scope.deliveryNote.deliveryDate = dateUtility.formatDateForApp($scope.deliveryNote.deliveryDate);
      hideLoadingModal();
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

    function resolveInitPromises(){
      $q.all(_initPromises).then(function(){
        // TODO switch on state?
      });
    }

    // constructor
    function init(){
      // scope vars
      $scope.state = $routeParams.state;
      $scope.viewName += ' ' + $scope.state;
      $scope.displayError = false;
      $scope.formErrors = [];

      // private vars
      _initPromises = [];
      switch($scope.state){
        case 'view':
          $scope.readOnly = true;
          getDeliveryNote();
          resolveInitPromises();
          break;
        case 'create':

          break;
        default:
          $location.path('/');
          break;
      }
    }
    init();
  });
