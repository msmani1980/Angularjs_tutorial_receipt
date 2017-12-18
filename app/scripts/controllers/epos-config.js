'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EposConfigCtrl
 * @description
 * # EposConfigCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EposConfigCtrl', function ($scope, dateUtility, eposConfigFactory, $location, $routeParams, $q) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Epos Configuration';
    $scope.modules = [];
    
    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };
      
    this.getModuleSuccess = function(dataFromAPI) {
      $scope.modules = angular.copy(dataFromAPI);
    };
    
    this.initDependenciesSuccess = function(result) {
      $this.getModuleSuccess(result[0].module);
      $this.hideLoadingModal();
    };
    
    this.initDependenciesError = function(errorResponse) {
      $scope.errorResponse = errorResponse[0];
      $scope.displayError = true;
      $this.hideLoadingModal();
    };
    
    this.makeInitPromises = function() {
      companyId = eposConfigFactory.getCompanyId();
      var promises = [
        eposConfigFactory.getModules(companyId)
      ];
      return promises;
    };
      
    this.init = function() {
      $this.showLoadingModal('Loading Data');
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess, $this.initDependenciesError);
    };

    this.init();
    
  });
