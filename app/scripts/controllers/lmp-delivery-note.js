'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:LmpDeliveryNoteCtrl
 * @description
 * # LmpDeliveryNoteCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('LmpDeliveryNoteCtrl', function ($scope, stockManagementService) {

    // Scope vars
    $scope.state = null;
    $scope.id = null;

    function init(){
      stockManagementService.getDeliveryNote().then(function(){});
    }
    init();
  });
