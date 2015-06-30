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
    var companyId = GlobalMenuService.company.get();

    // scope vars
    $scope.viewName = 'Create Store Number';

    $scope.company = {
      storeNumber: '',
      startDate: '',
      endDate: ''
    };

    // scope functions
    $scope.submitForm = function(){
      var payload = {id:companyId};
      companyService.createCompany(payload).then(function(response){
        console.log(response);
      }, function(error){
        console.log(error);
      });
    };

  });
