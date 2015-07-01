'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CreatestorenumberCtrl
 * @description
 * # CreatestorenumberCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('createStoreNumberCtrl', function ($scope, companyService, GlobalMenuService) {

    // private controller vars
    var _companyId = GlobalMenuService.company.get(),
      _companyDefault = {
        storeNumber: null,
        startDate: null,
        endDate: null
      };

    // scope vars
    $scope.viewName = 'Create Store Number';

    // scope functions
    $scope.submitForm = function(){
      if($scope.createStoreNumberForm.$invalid) {
        console.log($scope.createStoreNumberForm);
        return false;
      }
      var payload = angular.copy($scope.company);
      payload.id = _companyId;
      payload.action = 'stores';

      companyService.createStore(payload).then(function(response){
        console.log(response);
      }, function(error){
        console.log(error);
      });
    };

    this.constructor = function(){
      $scope.formData = angular.copy(_companyDefault);
    };
    this.constructor();

  });
