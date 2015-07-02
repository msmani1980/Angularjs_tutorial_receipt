'use strict';
/* global $*/
/**
 * @ngdoc function
 * @name ts5App.controller:DeliveryNotesListCtrl
 * @description
 * # DeliveryNotesListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DeliveryNotesListCtrl', function ($scope) {

    $scope.viewName = 'Delivery Notes Management';
    $scope.search = {};

  });
