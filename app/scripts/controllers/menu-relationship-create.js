'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuRelationshipCreateCtrl
 * @description
 * # MenuRelationshipCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuRelationshipCreateCtrl', function ($scope) {
    $scope.viewName = 'Create Menu Relationship';
    $scope.buttonText = 'Save';
    $scope.formData = {
      menuCode: '',
      menuName: '',
      stations: [],
      startDate: '',
      endDate: ''
    };
  });
