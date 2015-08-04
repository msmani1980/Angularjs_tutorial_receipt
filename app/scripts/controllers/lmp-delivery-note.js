'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:LmpDeliveryNoteCtrl
 * @description
 * # LmpDeliveryNoteCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('LmpDeliveryNoteCtrl', function ($scope, stockManagementService, $routeParams, $location, dateUtility) {

    // static scope vars
    $scope.viewName = 'Delivery note';
    $scope.fpo = {
      ullageReasons: ['jus cause', 'Some reason']
    };

    function getDeliveryNote(){
      displayLoadingModal();
      stockManagementService.getDeliveryNote($routeParams.id).then(setDeliveryNote, showResponseErrors);
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

    // constructor
    function init(){
      // scope vars
      $scope.state = $routeParams.state;
      $scope.viewName += ' ' + $scope.state;
      $scope.displayError = false;
      $scope.formErrors = [];

      switch($scope.state){
        case 'view':
          $scope.readOnly = true;
          getDeliveryNote();
          break;
        default:
          $location.path('/');
          break;
      }
    }
    init();
  });
