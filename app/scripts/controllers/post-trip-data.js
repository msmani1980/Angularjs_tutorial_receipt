'use strict';
/*global $*/

/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataCtrl', function ($scope) {
    $scope.viewName = 'Post Trip Data';
    $('.employeeID-multiple-select').select2();

    $scope.readOnly = false;


    function CREATE(){
      // create
      // create/back button
    }

    function READ(){
      // view
      // readOnly
      // autopopulate fields
    }

    function UPDATE(){

      // edit
      // autopopulate fields
      // save/back button
    }




  });
