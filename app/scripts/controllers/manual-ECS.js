'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ExciseDutyListCtrl
 * @description
 * # ExciseDutyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualECSCtrl', function ($scope, $q, manualECSFactory, globalMenuService) {

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    }

    $scope.toggleActiveView = function (showCreateView) {
      $scope.isCreateViewActive = showCreateView;
    };

    function completeInit(responseCollectionFromAPI) {
      $scope.catererStationList = angular.copy(responseCollectionFromAPI[0].response);
      $scope.companyStationList = angular.copy(responseCollectionFromAPI[1].response);
      hideLoadingModal();
    }

    function makeInitPromises() {
      var companyId = globalMenuService.company.get();
      var promises = [
        manualECSFactory.getCatererStationList({}),
        manualECSFactory.getCompanyStationList(companyId, 0)
      ];
      $q.all(promises).then(completeInit, showErrors);
    }

    function init() {
      showLoadingModal('Initializing data');
      $scope.isCreateViewActive = true;
      makeInitPromises();
    }

    init();

  });
