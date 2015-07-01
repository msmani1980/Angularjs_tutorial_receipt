'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CreatestorenumberCtrl
 * @description
 * # CreatestorenumberCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('createStoreNumberCtrl', function ($scope, companyService, GlobalMenuService, ngToast) {

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
    $scope.submitForm = function(isValid){
      if($scope.createStoreNumberForm.$invalid) {
        return false;
      }
      var payload = angular.copy($scope.formData);
      payload.id = _companyId;
      payload.action = 'stores';

      companyService.createStore(payload).then(function(){
        this.constructor();
        showMessage('successful!', 'success');
      }, function(error){
        showMessage('failed!', 'warning');
        $scope.displayError = true;
        if ('data' in response) {
          $scope.formErrors = response.data;
        }
      });
    };

    function showMessage(message, messageType) {
      ngToast.create({ className: messageType, dismissButton: true, content: '<strong>Create Store Number</strong>: ' + message });
    }

    this.constructor = function(){
      $scope.formData = angular.copy(_companyDefault);
      $scope.storeNumbersList = [
        {number:'abc123', startDate:'07/01/2015', endDate:'07/02/2015'},
        {number:'abc345', startDate:'07/01/2015', endDate:'07/03/2015'},
        {number:'abc567', startDate:'07/01/2015', endDate:'07/04/2015'},
        {number:'abc789', startDate:'07/01/2015', endDate:'07/05/2015'}
      ]
      // TODO - Show a list of store numbers when API is completed
    };
    this.constructor();

  });
